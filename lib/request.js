var https = require('https');
var qs = require('querystring');
var q = require('q');

var noop = function () {};

function Request(options) {
  this.apiKey = options.apiKey;
  this.domain = options.domain;
  this.username = 'api';
  this.host = 'api.mailgun.net';
  this.endpoint = '/v2';
  this.auth = [this.username, this.apiKey].join(':');
}

Request.prototype.request = function (method, resource, data, fn) {
  this.deferred = q.defer();

  if (typeof data === 'function' && !fn) {
    fn = data;
    data = {};
  }

  if (!fn) fn = noop;

  this.path = ''.concat(this.endpoint, this.getDomain(resource), resource);

  this.payload = this.preparePayload(data);

  // prepare headers
  var headers = {};
  if (method === 'GET' || method === 'DELETE') {
    if (this.payload) this.path = this.path.concat('?', this.payload);
  }
  else {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    headers['Content-Length'] = this.payload.length || 0;
  }

  var opts = {
    hostname: this.host,
    path: this.path,
    method: method,
    headers: headers,
    auth: this.auth,
    agent: false
  };

  this.performRequest(opts, fn);

  return this.deferred.promise;
};

Request.prototype.preparePayload = function (data) {
  var params = {};

  // prepare members vars, has to be valid JSON
  if (data && data.vars && typeof data.vars === 'object') {
    for (var key in data) {
      params[key] = data[key];
    }
    params.vars = JSON.stringify(params.vars);
  }
  else if (data && data.members && typeof data.members === 'object') {
    for (var key in data) {
      params[key] = data[key];
    }
    params.members = JSON.stringify(params.members);
  }
  else {
    params = data;
  }

  return qs.stringify(params);
};

Request.prototype.performRequest = function (options, fn) {
  var self = this;
  var method = options.method;

  var req = https.request(options, function (res) {
    var chunks = '';
    var error;

    res.on('data', function (chunk) {
      chunks += chunk;
    });

    res.on('error', function (err) {
      error = err;
    });

    res.on('end', function () {
      var body;

      if (!error && res.headers['content-type'].indexOf('application/json') >= 0) {
        try {
          body = JSON.parse(chunks);
        }
        catch (e) {
          error = e;
        }
      }

      if (!error && res.statusCode !== 200) {
        var msg = body ? body.message || body.response : body || chunks;
        error = new Error(msg);
      }

      if (error) {
        self.deferred.reject(error);
      }
      else {
        self.deferred.resolve(body);
      }

      return fn(error, body);
    });
  });

  req.on('error', function (e) {
    self.deferred.reject(e);
    return fn(e);
  });

  if (this.payload && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    req.write(this.payload);
  }

  req.end();
};

Request.prototype.getDomain = function (resource) {
  var d = '/' + this.domain;

  //filter out API calls that do not require a domain specified
  if ((resource.indexOf('/routes') >= 0)
    || (resource.indexOf('/lists') >= 0)
    || (resource.indexOf('/address') >= 0)
    || (resource.indexOf('/domains') >= 0 )) {
    d = '';
  }

  return d;
};

module.exports = Request;