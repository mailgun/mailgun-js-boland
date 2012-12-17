/*!
 * mailgun-js
 * Copyright(c) 2012 OneLobby <bojan@onelobby.com>
 * MIT Licensed
 */


var request = require('request');

/**
 * Creates new Mailgun object
 * @param api_key {String} the API Key for the mailgun account
 * @param domain {String} the mailgun domain
 * @type {Function}
 */
var Mailgun = module.exports = function (api_key, domain) {
  this.username = 'api'
  this.api_key = api_key;
  this.domain = domain;
  this.protocol = 'https://';
  this.host = 'api.mailgun.net';
  this.endpoint = '/v2';

  this.headers = {};
  var b = new Buffer([this.username, this.api_key].join(':'));
  this.headers['Authorization'] = "Basic " + b.toString('base64');
};

/**
 * Creates a new email message and sends it using mailgun
 * @param data {Object} the object containing the data to be sent.
 *                      Required parameters are 'to', 'from', and 'text' or 'html'
 * @param cb {Function} callback function accepting error, response and body
 * @type {Function}
 */
Mailgun.prototype.sendMessage = function (data, cb) {
  if (!data.to) {
    return cb(new Error('You must include a \'to\' number.'));
  }
  if (!data.from) {
    return cb(new Error('You must include a \'from\' number.'));
  }
  if (!data.text && !data.html) {
    return cb(new Error('You must include a \'text\' or \'html\' parameter.'));
  }

  return this.request('POST', '/messages', data, cb);
};

/**
 * Lists mailboxes associated with the mailgun account
 * @param data {Object} the optional object containing the GET options 'limit' and 'skip'
 * @param cb {Function} callback function accepting error, response and body
 * @type {Function}
 */
Mailgun.prototype.getMailboxes = function (data, cb) {
  return this.request('GET', '/mailboxes', data, cb);
};

/**
 * Creates a new mailbox associated with the mailgun account
 * @param data {Object} the object containing the new mailbox name ('mailbox') and new password ('password')
 * @param cb {Function} callback function accepting error, response and body
 * @type {Function}
 */
Mailgun.prototype.createMailbox = function (data, cb) {
  if (!data.mailbox) {
    return cb(new Error('You must include name of the mailbox in the \'mailbox\' parameter.'));
  }
  if (!data.password) {
    return cb(new Error('You must include a password for the new mailbox.'));
  }

  return this.request('POST', '/mailboxes', data, cb);
};

/**
 * Deletes a mailbox associated with the mailgun account
 * @param mailbox {String} the mailbox to be deleted
 * @param cb {Function} callback function accepting error, response and body
 * @type {Function}
 */
Mailgun.prototype.deleteMailbox = function (mailbox, cb) {
  if (!mailbox) {
    return cb(new Error('You must include name of the mailbox.'));
  }

  return this.request('DELETE', '/mailboxes/' + mailbox, cb);
};

/**
 * Updates the mailbox associated with the mailgun account
 * @param data {Object} the object containing the mailbox name ('mailbox') and new password ('password')
 * @param cb {Function} callback function accepting error, response and body
 * @type {Function}
 */
Mailgun.prototype.updateMailbox = function (data, cb) {
  if (!data.mailbox) {
    return cb(new Error('You must include name of the mailbox in the \'mailbox\' parameter.'));
  }
  if (!data.password) {
    return cb(new Error('You must include a password for the mailbox.'));
  }

  var mailbox = data.mailbox;
  delete data.mailbox;

  return this.request('PUT', '/mailboxes/' + mailbox, data, cb);
};


/**
 * Lists routes associated with the mailgun account
 * @param data {Object} the optional object containing the GET options 'limit' and 'skip'
 * @param cb {Function} callback function accepting error, response and body
 * @type {Function}
 */
Mailgun.prototype.getRoutes = function (data, cb) {
  return this.request('GET', '/routes', data, cb);
};

/**
 * Returns a single route object based on its ID.
 * @param id {String} the route ID
 * @param cb {Function} callback function accepting error, response and body
 * @type {Function}
 */
Mailgun.prototype.getRoute = function (id, cb) {
  if (!id) {
    return cb(new Error('You must include id of the route.'));
  }

  return this.request('GET', '/routes/' + id, cb);
};

/**
 * Creates a new route
 * @param data {Object} the object containing the priority, description, expression and action as strings
 * @param cb {Function} callback function accepting error, response and body
 * @type {Function}
 */
Mailgun.prototype.createRoute = function (data, cb) {
  if (!data.expression) {
    return cb(new Error('You must include route expression.'));
  }
  if (!data.action) {
    return cb(new Error('You must include route action.'));
  }

  return this.request('POST', '/routes', data, cb);
};

/**
 * Updates a given route by ID. All data parameters optional:
 * this API call only updates the specified fields leaving others unchanged.
 * @param id {String} the route ID
 * @param data {Object} the object containing the priority, description, expression and action as strings
 * @param cb {Function} callback function accepting error, response and body
 * @type {Function}
 */
Mailgun.prototype.updateRoute = function (id, data, cb) {
  if (!id) {
    return cb(new Error('You must include id of the route.'));
  }

  return this.request('PUT', '/routes/' + id, data, cb);
};

/**
 * Deletes a route based on the id.
 * @param id {String} the id of the route to be deleted
 * @param cb {Function} callback function accepting error, response and body
 * @type {Function}
 */
Mailgun.prototype.deleteRoute = function (id, cb) {
  if (!id) {
    return cb(new Error('You must include the ID of the mailbox.'));
  }

  return this.request('DELETE', '/routes/' + id, cb);
};

/**
 * The main function that does all the work. The client really shouldn't call this.
 * @param method {String} HTTP method
 * @param resource {String} the resource
 * @param data {Object} the data to be sent in the request
 * @param cb {Function} callback for the request
 * @return
 */

Mailgun.prototype.request = function (method, resource, data, cb) {

  var self = this;

  if (typeof data === 'function' && !cb) {
    cb = data;
    data = {};
  }

  var getDomain = function() {
    var d = '/' + self.domain;
    //filter out API calls that do not require a domain specified
    if (resource.indexOf('route') >= 0) {
      d = '';
    }
    return d;
  };

  var url = '';
  url = url.concat(
    this.protocol,
    this.username, ':', this.api_key,
    '@',
    this.host,
    this.endpoint,
    getDomain(),
    resource);

  console.log(url);

  var opts = {
    url: url,
    method: method,
    headers: this.headers,
    form: data
  };

  var responseCb = function (error, response, body) {
    if (response && (response.headers['content-type'] === 'application/json')) {
      try {
        body = JSON.parse(body);

        if (!error && response.statusCode !== 200) {
          error = new Error(body.message);
        }
      } catch (e) {

      }
    }

    return cb(error, response, body);
  };

  return request(opts, responseCb);
};