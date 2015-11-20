var scmp = require('scmp');
var crypto = require('crypto');

var Attachment = require('./attachment');
var Request = require('./request');
var builder = require('./build');
var resources = require('./schema').definitions;

var mailgunExpirey = 15 * 60 * 1000;
var mailgunHashType = 'sha256';
var mailgunSignatureEncoding = 'hex';

var Mailgun = function (options) {
  this.username = 'api';
  this.apiKey = options.apiKey;
  this.domain = options.domain;
  this.auth = [this.username, this.apiKey].join(':');
  this.mute = options.mute || false;
  this.timeout = options.timeout;

  this.host = options.host || 'api.mailgun.net';
  this.endpoint = options.endpoint || '/v3';
  this.protocol = options.protocol || 'https:';
  this.port = options.port || 443;
  this.retry = options.retry || 1;

  if (options.proxy) {
    this.proxy = options.proxy;
  }

  this.options = {
    host: this.host,
    endpoint: this.endpoint,
    protocol: this.protocol,
    port: this.port,
    auth: this.auth,
    proxy: this.proxy,
    timeout: this.timeout,
    retry: this.retry
  };

  this.mailgunTokens = {};
};

Mailgun.prototype.getDomain = function (method, resource) {
  var d = this.domain;

  //filter out API calls that do not require a domain specified
  if ((resource.indexOf('/routes') >= 0)
    || (resource.indexOf('/lists') >= 0)
    || (resource.indexOf('/address') >= 0)
    || (resource.indexOf('/domains') >= 0 )) {
    d = '';
  }
  else if ((resource.indexOf('/messages') >= 0)
    && (method === 'GET' || method === 'DELETE')) {
    d = 'domains/' + this.domain;
  }

  return d;
};

Mailgun.prototype.request = function (method, resource, data, fn) {
  var fullpath = resource;
  var domain = this.getDomain(method, resource);
  if (domain) {
    fullpath = '/'.concat(domain, resource);
  }

  var req = new Request(this.options);
  return req.request(method, fullpath, data, fn);
};

Mailgun.prototype.post = function (path, data, fn) {
  var req = new Request(this.options);
  return req.request('POST', path, data, fn);
};

Mailgun.prototype.get = function (path, data, fn) {
  var req = new Request(this.options);
  return req.request('GET', path, data, fn);
};

Mailgun.prototype.delete = function (path, data, fn) {
  var req = new Request(this.options);
  return req.request('DELETE', path, data, fn);
};

Mailgun.prototype.put = function (path, data, fn) {
  var req = new Request(this.options);
  return req.request('PUT', path, data, fn);
};


Mailgun.prototype.validateWebhook = function (timestamp, token, signature) {
  var self = this;

  var adjustedTimestamp = parseInt(timestamp, 10) * 1000;
  var fresh = (Math.abs(Date.now() - adjustedTimestamp) < mailgunExpirey);

  if (!fresh) {
    if (!this.mute) {
      console.error('[mailgun] Stale Timestamp: this may be an attack');
      console.error('[mailgun] However, this is most likely your fault\n');
      console.error('[mailgun] run `ntpdate ntp.ubuntu.com` and check your system clock\n');
      console.error('[mailgun] System Time: ' + new Date().toString());
      console.error('[mailgun] Mailgun Time: ' + new Date(adjustedTimestamp).toString(), timestamp);
      console.error('[mailgun] Delta: ' + (Date.now() - adjustedTimestamp));
    }
    return false;
  }

  if (this.mailgunTokens[token]) {
    if (!this.mute) {
      console.error('[mailgun] Replay Attack');
    }
    return false;
  }

  this.mailgunTokens[token] = true;

  setTimeout(function () {
    delete self.mailgunTokens[token];
  }, mailgunExpirey + (5 * 1000));

  return scmp(
    signature
    , crypto.createHmac(mailgunHashType, self.apiKey)
      .update(new Buffer(timestamp + token, 'utf-8'))
      .digest(mailgunSignatureEncoding)
  );
};

builder.build(Mailgun, resources);

Mailgun.prototype.Attachment = Attachment;

Mailgun.prototype.Mailgun = Mailgun;

module.exports = function (options) {
  return new Mailgun(options);
};
