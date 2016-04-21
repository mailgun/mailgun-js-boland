var https = require('https');
var http = require('http');
var proxy = require('proxy-agent');
var qs = require('querystring');
var q = require('q');
var fs = require('fs');
var Readable = require('stream').Readable;
var FormData = require('form-data');
var Attachment = require('./attachment');
var retry = require('async').retry;

var debug = require('debug')('mailgun-js');

function noop () {
};

function isOk(i) {
  return typeof i !== 'undefined' && i !== null;
}

function Request(options) {
  this.host = options.host;
  this.protocol = options.protocol;
  this.port = options.port;
  this.endpoint = options.endpoint;
  this.auth = options.auth;
  this.proxy = options.proxy;
  this.timeout = options.timeout;
  this.retry = options.retry || 1;
}

Request.prototype.request = function (method, resource, data, fn) {
  this.deferred = q.defer();

  var self = this;

  if (typeof data === 'function' && !fn) {
    fn = data;
    data = {};
  }

  if (!fn) fn = noop;

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
      var length = this.payload ? Buffer.byteLength(this.payload) : 0;
      this.headers['Content-Length'] = length;
    }
  }

  // check for MIME is true in case of messages GET
  if (method === 'GET' &&
    path.indexOf('/messages') >= 0 &&
    params && params.MIME === true) {
    this.headers.Accept = 'message/rfc2822';
  }

  debug('%s %s', method, path);

  var opts = {
    hostname: this.host,
    port: this.port,
    protocol: this.protocol,
    path: path,
    method: method,
    headers: this.headers,
    auth: this.auth,
    agent: this.proxy ? proxy(this.proxy, true) : false,
    timeout: this.timeout
  };

  function finalCb(error, body) {
    if (error) {
      self.deferred.reject(error);
    }
    else {
      self.deferred.resolve(body);
    }

    return fn(error, body);
  }

  if (this.retry > 1) {
    retry(this.retry, function (retryCb) {
      self.callback = retryCb;
      self.performRequest(opts);
    }, finalCb);
  }
  else {
    this.callback = finalCb;
    this.performRequest(opts);
  }

  return this.deferred.promise;
};

function getDataValue(key, input) {
  if (isSpecialParam(key) && (typeof input === 'object')) {
    return JSON.stringify(input);
  }
  else if (typeof input === 'number' || typeof input === 'boolean') {
    return input.toString();
  }
  else {
    return input;
  }
}

function isSpecialParam(paramKey) {
  var key = paramKey.toLowerCase();
  return ((key === 'vars' || key === 'members' || key === 'recipient-variables') || (key.indexOf('v:') === 0));
}

Request.prototype.prepareData = function (data) {
  var params = {};

  for (var key in data) {
    if (key !== 'attachment' && key !== 'inline' && isOk(data[key])) {
      var value = getDataValue(key, data[key]);
      if(isOk(value)) {
        params[key] = value;
      }
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
    if(isOk(obj)) {
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
        function appendKey(element) {
          if(isOk(element)) {
            var value = getDataValue(key, element);
            if(isOk(value)) {
              self.form.append(key, value);
            }
          }
        }

        obj.forEach(appendKey);
      }
      else {
        var value = getDataValue(key, obj);
        if(isOk(value)) {
          this.form.append(key, value);
        }
      }
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
    self.form.append('message', obj);
  }
};

Request.prototype.handleAttachmentObject = function (key, obj) {
  if (!this.form) this.form = new FormData();

  if (Buffer.isBuffer(obj)) {
    debug('appending buffer to form data. key: %s', key);
    this.form.append(key, obj, {
      filename: 'file'
    });
  }
  else if (typeof obj === 'string') {
    debug('appending stream to form data. key: %s obj: %s', key, obj);
    this.form.append(key, fs.createReadStream(obj));
  } else if ((typeof obj === 'object') && (obj.readable === true)) {
    debug('appending readable stream to form data. key: %s obj: %s', key, obj);
    this.form.append(key, obj);
  } else if ((typeof obj === 'object') && (obj instanceof Attachment)) {
    var attachmentType = obj.getType();
    if (attachmentType === 'path') {
      debug('appending attachment stream to form data. key: %s data: %s filename: %s', key, obj.data, obj.filename);
      this.form.append(key, fs.createReadStream(obj.data), {
        filename: obj.filename || 'attached file'
      });
    }
    else if (attachmentType === 'buffer') {
      debug('appending attachment buffer to form data. key: %s filename: %s', key, obj.filename);
      var formOpts = {
        filename: obj.filename || 'attached file'
      };

      if (obj.contentType) {
        formOpts.contentType = obj.contentType
      }

      if (obj.knownLength) {
        formOpts.knownLength = obj.knownLength
      }

      this.form.append(key, obj.data, formOpts);
    }
    else if (attachmentType === 'stream') {
      if (obj.knownLength && obj.contentType) {
        debug('appending attachment stream to form data. key: %s filename: %s', key, obj.filename);

        this.form.append(key, obj.data, {
          filename: obj.filename || 'attached file',
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

    debug('response status code: %s content type: %s error: %s', res.statusCode, res.headers['content-type'], error);

    // FIXME: An ugly hack to overcome invalid response type in mailgun api (see http://bit.ly/1eF30fU).
    // We skip content-type validation for 'campaings' endpoint assuming it is JSON.
    var skipContentTypeCheck = res.req && res.req.path && res.req.path.match(/\/campaigns/);
    if (chunks && !error && (skipContentTypeCheck || (res.headers['content-type'].indexOf('application/json') >= 0))) {
      try {
        body = JSON.parse(chunks);
      } catch (e) {
        error = e;
      }
    }

    if (process.env.DEBUG_MAILGUN_FORCE_RETRY) {
      error = new Error('Force retry error');
      delete process.env.DEBUG_MAILGUN_FORCE_RETRY;
    }

    if (!error && res.statusCode !== 200) {
      var msg = body ? body.message || body.response : body || chunks || res.statusMessage;
      error = new Error(msg);
      error.statusCode = res.statusCode;
    }

    return self.callback(error, body);
  });
};

Request.prototype.performRequest = function (options) {
  var self = this;
  var method = options.method;

  if (this.form && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {

    this.form.submit(options, function (err, res) {
      if (err) {
        return self.callback(err);
      }

      return self.handleResponse(res);
    });
  }
  else {
    var req;

    if (options.protocol === 'http:') {
      req = http.request(options, function (res) {
        return self.handleResponse(res);
      });
    }
    else {
      req = https.request(options, function (res) {
        return self.handleResponse(res);
      });
    }

    if (options.timeout) {
      req.setTimeout(options.timeout, function () {
        // timeout occurs
        req.abort();
      });
    }

    req.on('error', function (e) {
      return self.callback(e);
    });

    if (this.payload && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      req.write(this.payload);
    }

    req.end();
  }
};

module.exports = Request;
