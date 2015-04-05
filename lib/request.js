var https = require('https');
var proxy = require('proxy-agent');
var qs = require('querystring');
var q = require('q');
var fs = require('fs');
var Readable = require('stream').Readable;
var FormData = require('form-data');
var Attachment = require('./attachment');

var debug = require('debug')('mailgun-js');

var noop = function () {
};

function Request(options) {
  this.host = 'api.mailgun.net';
  this.endpoint = '/v2';
  this.auth = options.auth;
  this.proxy = options.proxy;
}

Request.prototype.request = function (method, resource, data, fn) {
  this.deferred = q.defer();

  if (typeof data === 'function' && !fn) {
    fn = data;
    data = {};
  }

  if (!fn) fn = noop;

  this.callback = fn;

  var path = ''.concat(this.endpoint, resource);

  var params = this.prepareData(data);

  this.payload = '';

  var isMIME = path.indexOf('/messages.mime') >= 0;

  this.headers = {};
  if (method === 'GET' || method === 'DELETE') {
    this.payload = qs.stringify(params);
    if (this.payload) path = path.concat('?', this.payload);
  }
  else {
    this.headers['Content-Type'] = isMIME ? 'multipart/form-data' : 'application/x-www-form-urlencoded';

    if (params && (params.attachment || params.inline || (isMIME && params.message))) {
      this.prepareFormData(params);
    }
    else {
      this.payload = qs.stringify(params);
      var length = this.payload ? this.payload.length : 0;
      this.headers['Content-Length'] = length;
    }
  }

  // check for MIME is true in case of messages GET
  if (method === 'GET' &&
    path.indexOf('/messages') >= 0 &&
    params && params.MIME === true) {
    this.headers['Accept'] = 'message/rfc2822'
  }

  debug('%s %s', method, path);

  var opts = {
    hostname: this.host,
    path: path,
    method: method,
    headers: this.headers,
    auth: this.auth,
    agent: this.proxy ? proxy(this.proxy, true) : false
  };

  this.performRequest(opts);

  return this.deferred.promise;
};

function isSpecialParam(paramKey) {
  var key = paramKey.toLowerCase();
  return ((key === 'vars' || key === 'members' || key === 'recipient-variables')
  || (key.indexOf('v:') === 0));
}

Request.prototype.prepareData = function (data) {
  var params = {};

  for (var key in data) {
    if (isSpecialParam(key) && (typeof data[key] === 'object')) {
      params[key] = JSON.stringify(data[key]);
    }
    else {
      params[key] = data[key];
    }
  }

  return params;
};

Request.prototype.prepareFormData = function (data) {
  this.form = new FormData();
  var self = this;

  for (var key in data) {
    var obj = data[key];
    if (key === 'attachment' || key === 'inline') {
      if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
          this.handleAttachmentObject(key, obj[i]);
        }
      }
      else {
        this.handleAttachmentObject(key, obj);
      }
    }
    else if (key === 'message') {
      this.handleMimeObject(key, obj);
    }
    else if (Array.isArray(obj)) {
      obj.forEach(function (element) {
        self.form.append(key, element);
      });
    }
    else {
      this.form.append(key, obj);
    }
  }

  this.headers = this.form.getHeaders();
};

Request.prototype.handleMimeObject = function (key, obj) {
  var self = this;
  if (typeof obj === 'string') {
    if (fs.existsSync(obj) && fs.statSync(obj).isFile()) {
      self.form.append('message', fs.createReadStream(obj));
    }
    else {
      self.form.append('message', new Buffer(obj), {
        filename: 'message.mime',
        contentType: 'message/rfc822',
        knownLength: obj.length
      });
    }
  }
  else if (obj instanceof Readable) {
    self.form.append('message', obj)
  }
};

Request.prototype.handleAttachmentObject = function (key, obj) {
  if (!this.form) this.form = new FormData();

  if (Buffer.isBuffer(obj)) {
    debug('appending buffer to form data. key: %s', key);
    this.form.append(key, obj, {filename: 'file'});
  }
  else if (typeof obj === 'string') {
    debug('appending stream to form data. key: %s obj: %s', key, obj);
    this.form.append(key, fs.createReadStream(obj));
  }
  else if ((typeof obj === 'object') && (obj instanceof Attachment)) {
    var attachmentType = obj.getType();
    if (attachmentType === 'path') {
      debug('appending attachment stream to form data. key: %s data: %s filename: %s', key, obj.data, obj.filename);
      this.form.append(key, fs.createReadStream(obj.data), {filename: obj.filename || 'file'});
    }
    else if (attachmentType === 'buffer') {
      debug('appending attachment buffer to form data. key: %s filename: %s', key, obj.filename);
      this.form.append(key, obj.data, {filename: obj.filename || 'file'});
    }
    else if (attachmentType === 'stream') {
      if (obj.knownLength && obj.contentType) {
        debug('appending attachment buffer to form data. key: %s filename: %s', key, obj.filename);

        this.form.append(key, obj.data, {
          filename: obj.filename || 'file',
          contentType: obj.contentType,
          knownLength: obj.knownLength
        });
      }
      else {
        debug('missing content type or length for attachment stream. key: %s', key);
      }
    }
  }
  else {
    debug('unknown attachment type. key: %s', key);
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

    debug('response status code: %s content type: %s', res.statusCode, res.headers['content-type']);

    // FIXME: An ugly hack to overcome invalid response type in mailgun api (see http://bit.ly/1eF30fU).
    // We skip content-type validation for 'campaings' endpoint assuming it is JSON.
    var skipContentTypeCheck = res.req && res.req.path && res.req.path.match(/\/campaigns/);
    if (!error && (skipContentTypeCheck || (res.headers['content-type'].indexOf('application/json') >= 0))) {
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
      error.statusCode = res.statusCode;
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
    options.protocol = 'https:';

    this.form.submit(options, function (err, res) {
      if (err) {
        self.deferred.reject(err);
        return self.callback(err);
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