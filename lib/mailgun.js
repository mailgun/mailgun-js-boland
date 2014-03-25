var https = require('https');
var qs = require('querystring');
var Q = require('q');
var builder = require('./build');
var resources = require('./schema').definitions;

var noop = function () {};

var Mailgun = function (options) {
  this.apiKey = options.apiKey;
  this.domain = options.domain;
  this.username = 'api';
  this.host = 'api.mailgun.net';
  this.endpoint = '/v2';
  this.auth = [this.username, this.apiKey].join(':');
};

Mailgun.prototype.request = function (method, resource, data, fn) {
  var deferred = Q.defer();
  var self = this;

  if (typeof data === 'function' && !fn) {
    fn = data;
    data = {};
  }

  if (!fn) fn = noop;

  var getDomain = function () {
    var d = '/' + self.domain;

    //filter out API calls that do not require a domain specified
    if ((resource.indexOf('/routes') >= 0)
      || (resource.indexOf('/lists') >= 0)
      || (resource.indexOf('/address') >= 0)
      || (resource.indexOf('/domains') >= 0 )) {
      d = '';
    }

    return d;
  };

  var path = ''.concat(this.endpoint, getDomain(), resource);

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

  var headers = {};
  var qsdata = qs.stringify(params);

  if (method === 'GET' || method === 'DELETE') {
    if (qsdata) path = path.concat('?', qsdata);
  }
  else {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    headers['Content-Length'] = qsdata.length || 0;
  }


  var opts = {
    hostname: this.host,
    path: path,
    method: method,
    headers: headers,
    auth: this.auth,
    agent: false
  };

  var req = https.request(opts, function (res) {
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
        deferred.reject(error);
      }
      else {
        deferred.resolve(body);
      }

      return fn(error, body);
    });
  });

  req.on('error', function (e) {
    deferred.reject(e);
    return fn(e);
  });

  if (qsdata && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    req.write(qsdata);
  }

  req.end();

  return deferred.promise;
};

Mailgun.prototype.post = function (path, data, fn) {
  return this.request('POST', path, data, fn);
};

Mailgun.prototype.get = function (path, data, fn) {
  return this.request('GET', path, data, fn);
};

Mailgun.prototype.delete = function (path, data, fn) {
  return this.request('DELETE', path, data, fn);
};

Mailgun.prototype.put = function (path, data, fn) {
  return this.request('PUT', path, data, fn);
};

builder.build(Mailgun, resources);

module.exports = Mailgun;

