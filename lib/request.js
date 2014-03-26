var https = require('https');
var qs = require('querystring');
var q = require('q');
var fs = require('fs');
var FormData = require('form-data');
var Attachment = require('./attachment');

var noop = function () {};

function Request(options) {
  this.host = 'api.mailgun.net';
  this.endpoint = '/v2';
  this.auth = options.auth;
}

Request.prototype.request = function (method, resource, data, fn) {
  this.deferred = q.defer();

  if (typeof data === 'function' && !fn) {
    fn = data;
    data = {};
  }

  if (!fn) fn = noop;

  this.callback = fn;

  this.path = ''.concat(this.endpoint, resource);

  var params = this.prepareData(data);

  this.payload = '';

  this.headers = {};
  if (method === 'GET' || method === 'DELETE') {
    this.payload = qs.stringify(params);
    if (this.payload) this.path = this.path.concat('?', this.payload);
  }
  else {
    this.headers['Content-Type'] = 'application/x-www-form-urlencoded';

    if (params && params.attachment) {
      this.prepareFormData(params);
    }
    else {
      this.payload = qs.stringify(params);
      var length = this.payload ? this.payload.length : 0;
      this.headers['Content-Length'] = length;
    }
  }

  var opts = {
    hostname: this.host,
    path: this.path,
    method: method,
    headers: this.headers,
    auth: this.auth,
    agent: false
  };

  this.performRequest(opts);

  return this.deferred.promise;
};

Request.prototype.prepareData = function (data) {
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

  return params;
};

Request.prototype.prepareFormData = function (data) {
  this.form = new FormData();

  for (var key in data) {
    var obj = data[key];
    if (key === 'attachment') {
      if (Array.isArray(obj)) {
        obj.forEach(this.handleAttachmentObject, this);
      }
      else {
        this.handleAttachmentObject(obj);
      }
    }
    else {
      this.form.append(key, obj);
    }
  }

  this.headers = this.form.getHeaders();
};

Request.prototype.handleAttachmentObject = function (obj) {
  if (!this.form) this.form = new FormData();

  var key = 'attachment';

  if (Buffer.isBuffer(obj)) {
    this.form.append(key, obj, {filename: 'file'});
  }
  else if (typeof obj === 'string') {
    this.form.append(key, fs.createReadStream(obj));
  }
  else if ((typeof obj === 'object') && (obj instanceof Attachment)) {
    if (obj.data && Buffer.isBuffer(obj.data)) {
      this.form.append(key, obj.data, {filename: obj.filename || 'file'});
    }
  }
};

Request.prototype.handleResponse = function (res) {
  var self = this;
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

    return self.callback(error, body);
  });
};

Request.prototype.performRequest = function (options) {
  var self = this;
  var method = options.method;

  if (this.form && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.port = 443;
    options.host = this.host;
    options.protocol = 'https:';

    this.form.submit(options, function (err, res) {
      if (err) {
        self.deferred.reject(e);
        return self.callback(e);
      }

      return self.handleResponse(res);
    });
  }
  else {
    var req = https.request(options, function (res) {
      return self.handleResponse(res);
    });

    req.on('error', function (e) {
      self.deferred.reject(e);
      return self.callback(e);
    });

    if (this.payload && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      req.write(this.payload);
    }

    req.end();
  }
};

module.exports = Request;