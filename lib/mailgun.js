var Request = require('./request');
var builder = require('./build');
var resources = require('./schema').definitions;

var Mailgun = function (options) {
  this.options = options;
};

Mailgun.prototype.request = function (method, resource, data, fn) {
  var req = new Request(this.options);
  return req.request(method, resource, data, fn);
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

