var path = require('path');
var Attachment = require('./attachment');
var Request = require('./request');
var builder = require('./build');
var resources = require('./schema').definitions;

var Mailgun = function (options) {
  this.username = 'api';
  this.apiKey = options.apiKey;
  this.domain = options.domain;
  this.auth = [this.username, this.apiKey].join(':');
};

Mailgun.prototype.getDomain = function (resource) {
  var d = this.domain;

  //filter out API calls that do not require a domain specified
  if ((resource.indexOf('/routes') >= 0)
    || (resource.indexOf('/lists') >= 0)
    || (resource.indexOf('/address') >= 0)
    || (resource.indexOf('/domains') >= 0 )) {
    d = '';
  }

  return d;
};

Mailgun.prototype.request = function (method, resource, data, fn) {
  var fullpath = path.join('/', this.getDomain(resource), resource);

  var req = new Request({auth: this.auth});
  return req.request(method, fullpath, data, fn);
};

Mailgun.prototype.post = function (path, data, fn) {
  var req = new Request({auth: this.auth});
  return req.request('POST', path, data, fn);
};

Mailgun.prototype.get = function (path, data, fn) {
  var req = new Request({auth: this.auth});
  return req.request('GET', path, data, fn);
};

Mailgun.prototype.delete = function (path, data, fn) {
  var req = new Request({auth: this.auth});
  return req.request('DELETE', path, data, fn);
};

Mailgun.prototype.put = function (path, data, fn) {
  var req = new Request({auth: this.auth});
  return req.request('PUT', path, data, fn);
};

builder.build(Mailgun, resources);

Mailgun.Attachment = Attachment;

module.exports = Mailgun;

