/*!
 * mailgun-js
 * Copyright(c) 2012, 2013 OneLobby <bojan@onelobby.com>
 * MIT Licensed
 */

var https = require('https');
var qs = require('querystring');

var noop = function () {
};

/**
 * Initializes the Mailgun module
 * @param api_key {String} the API Key for the mailgun account
 * @param domain {String} the mailgun domain
 * @type {Function}
 */
module.exports = function (api_key, domain) {
  if (!api_key) {
    throw new Error('Mailgun "API key" required');
  }

  if (!domain) {
    throw new Error('Mailgun "domain" required');
  }

  var username = 'api';
  var host = 'api.mailgun.net';
  var endpoint = '/v2';
  var auth = [username, api_key].join(':');

  /**
   * The main function that does all the work. The client really shouldn't call this.
   * @param method {String} HTTP method
   * @param resource {String} the resource
   * @param data {Object} the data to be sent in the request
   * @param cb {Function} callback for the request
   * @return
   */
  function _request(method, resource, data, cb) {

    if (typeof data === 'function' && !cb) {
      cb = data;
      data = {};
    }

    if (!cb) cb = noop;

    var getDomain = function () {
      var d = '/' + domain;
      //filter out API calls that do not require a domain specified
      if ((resource.indexOf('routes') >= 0)
        || (resource.indexOf('lists') >= 0)
        || (resource.indexOf('domains') >= 0 )) {
        d = '';
      }
      return d;
    };

    var path = ''.concat(endpoint, getDomain(), resource);

    var qsdata = qs.stringify(data);

    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': qsdata.length
    };

    var opts = {
      hostname: host,
      path: path,
      method: method,
      headers: headers,
      auth: auth,
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
        if (error) {
          return cb(error, res);
        }

        if (res && (res.headers['content-type'].indexOf('application/json') == 0)) {
          try {
            var body = JSON.parse(chunks);
            if (!error && res.statusCode !== 200) {
              error = new Error(body.message);
            }
          }
          catch (e) {
          }
        }

        return cb(error, res, body);
      });
    });

    req.on('error', function (e) {
      return cb(e);
    });

    req.write(qsdata);
    req.end();
  }

  function _post(path, data, callback) {
    return _request('POST', path, data, callback);
  }

  function _get(path, data, callback) {
    return _request('GET', path, data, callback);
  }

  function _del(path, data, callback) {
    return _request('DELETE', path, data, callback);
  }

  function _put(path, data, callback) {
    return _request('PUT', path, data, callback);
  }

  return {

    /**
     * Expose helper methods to allow users to interact with parts of the api that
     * are not exposed already.
     *
     * Example
     *  mailgun.get('/stats',function(err,stats){
     *    console.log(stats)
     *  })
     */
    post: _post,
    get: _get,
    del: _del,
    put: _put,

    messages: {
      /**
       * Creates a new email message and sends it using mailgun
       * @param data {Object} the object containing the data to be sent.
       *                      Required parameters are 'to', 'from', and 'text' or 'html'
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      send: function (data, cb) {
        if (!data.to) {
          return (cb || noop)(new Error('You must include a "to" parameter.'));
        }
        if (!data.from) {
          return (cb || noop)(new Error('You must include a "from" parameter.'));
        }
        if (!data.text && !data.html) {
          return (cb || noop)(new Error('You must include a "text" or "html" parameter.'));
        }

        return _post('/messages', data, cb);
      }
    },

    mailboxes: {
      /**
       * Lists mailboxes associated with the mailgun account
       * @param data {Object} the optional object containing the GET options 'limit' and 'skip'
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      list: function (data, cb) {
        return _get('/mailboxes', data, cb);
      },

      /**
       * Creates a new mailbox associated with the mailgun account
       * @param data {Object} the object containing the new mailbox name ('mailbox') and new password ('password')
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      create: function (data, cb) {
        if (!data.mailbox) {
          return (cb || noop)(new Error('You must include name of the mailbox in the \'mailbox\' parameter.'));
        }
        if (!data.password) {
          return (cb || noop)(new Error('You must include a password for the new mailbox.'));
        }

        return _post('/mailboxes', data, cb);
      },

      /**
       * Deletes a mailbox associated with the mailgun account
       * @param mailbox {String} the mailbox to be deleted
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      del: function (mailbox, cb) {
        if (!mailbox || typeof mailbox !== 'string') {
          return (cb || noop)(new Error('You must include name of the mailbox.'));
        }

        return _del('/mailboxes/' + mailbox, cb);
      },

      /**
       * Updates the mailbox associated with the mailgun account
       * @param data {Object} the object containing the mailbox name ('mailbox') and new password ('password')
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      update: function (data, cb) {
        if (!data.mailbox) {
          return (cb || noop)(new Error('You must include name of the mailbox in the \'mailbox\' parameter.'));
        }
        if (!data.password) {
          return (cb || noop)(new Error('You must include a password for the mailbox.'));
        }

        var mailbox = data.mailbox;
        delete data.mailbox;

        return _put('/mailboxes/' + mailbox, data, cb);
      }
    },

    routes: {
      /**
       * Lists routes associated with the mailgun account
       * @param data {Object} the optional object containing the GET options 'limit' and 'skip'
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      list: function (data, cb) {
        return _get('/routes', data, cb);
      },

      /**
       * Returns a single route object based on its ID.
       * @param id {String} the route ID
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      get: function (id, cb) {
        if (!id || typeof id !== 'string') {
          return (cb || noop)(new Error('You must include id of the route.'));
        }

        return _get('/routes/' + id, cb);
      },

      /**
       * Creates a new route
       * @param data {Object} the object containing the priority, description, expression and action as strings
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      create: function (data, cb) {
        if (!data.expression) {
          return (cb || noop)(new Error('You must include route expression.'));
        }
        if (!data.action) {
          return (cb || noop)(new Error('You must include route action.'));
        }

        return _post('/routes', data, cb);
      },

      /**
       * Updates a given route by ID. All data parameters optional:
       * this API call only updates the specified fields leaving others unchanged.
       * @param id {String} the route ID
       * @param data {Object} the object containing the priority, description, expression and action as strings
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      update: function (id, data, cb) {
        if (!data || (typeof data !== 'object')) {
          return (cb || noop)(new Error('You must include data.'));
        }

        if (!id || typeof id !== 'string') {
          return cb(new Error('You must include id of the route.'));
        }

        return _put('/routes/' + id, data, cb);
      },

      /**
       * Deletes a route based on the id.
       * @param id {String} the id of the route to be deleted
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      del: function (id, cb) {
        if (!id || typeof id !== 'string') {
          return (cb || noop)(new Error('You must include the id of the route.'));
        }

        return _del('/routes/' + id, cb);
      }
    },

    lists: {
      /**
       * Returns a list of mailing lists under your account.
       * @param data {Object} the optional object containing the GET options 'address', 'limit' and 'skip'
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      list: function (data, cb) {
        return _get('/lists', data, cb);
      },

      /**
       * Returns a single mailing list by a given address.
       * @param address {String} the mailing list address
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      get: function (address, cb) {
        if (!address || typeof address !== 'string') {
          return (cb || noop)(new Error('You must include mailing list address.'));
        }

        return _get('/lists/' + address, cb);
      },

      /**
       * Creates a new mailing list.
       * @param data {Object} the object containing the address, name, description, and access_level as strings
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      create: function (data, cb) {
        if (!data.address) {
          return (cb || noop)(new Error('You must include mailing list address.'));
        }

        return _post('/lists', data, cb);
      },

      /**
       * Update mailing list properties, such as address, description or name.
       * @param address {String} mailing list address
       * @param data {Object} the object containing the address, name, description, and access_level as strings
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      update: function (address, data, cb) {
        if (!data || (typeof data !== 'object')) {
          return (cb || noop)(new Error('You must include data.'));
        }

        if (!address || typeof address !== 'string') {
          return (cb || noop)(new Error('You must include mailing list address.'));
        }

        return _put('/lists/' + address, data, cb);
      },

      /**
       * Deletes a mailing list.
       * @param address {String} mailing list address
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      del: function (address, cb) {
        if (!address || typeof address !== 'string') {
          return (cb || noop)(new Error('You must include mailing list address.'));
        }

        return _del('/lists/' + address, cb);
      },

      /**
       * Fetches mailing list stats.
       * @param address {String} mailing list address
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      stats: function (address, cb) {
        if (!address || typeof address !== 'string') {
          return (cb || noop)(new Error('You must include mailing list address.'));
        }

        return _get('/lists/' + address + '/stats', cb);
      },

      members: {
        /**
         * Fetches the list of mailing list members.
         * @param listAddress {String} mailing list address
         * @param data {Object} the optional object containing the GET options 'subscribed', 'limit' and 'skip'
         * @param cb {Function} callback function accepting error, response and body
         * @type {Function}
         */
        list: function (listAddress, data, cb) {
          if (!listAddress || typeof listAddress !== 'string') {
            var last = arguments.length - 1;
            var callback = (arguments[last] && (typeof arguments[last] === 'function')) ? arguments[last] : Function;
            return callback(new Error('You must include mailing list address.'));
          }

          return _get('/lists/' + listAddress + '/members', data, cb);
        },

        /**
         * Retrieves a mailing list member.
         * @param listAddress {String} mailing list address
         * @param memberAddress {String} member address
         * @param cb {Function} callback function accepting error, response and body
         * @type {Function}
         */
        get: function (listAddress, memberAddress, cb) {
          var last = arguments.length - 1;
          var callback = (arguments[last] && (typeof arguments[last] === 'function')) ? arguments[last] : Function;
          if (!listAddress || typeof listAddress !== 'string') {
            return callback(new Error('You must include mailing list address.'));
          }

          if (!memberAddress || typeof memberAddress !== 'string') {
            return callback(new Error('You must include member address.'));
          }

          return _get('/lists/' + listAddress + '/members/' + memberAddress, cb);
        },

        /**
         * Adds a member to the mailing list.
         * @param listAddress {String} mailing list address
         * @param data {Object} the object containing the address, name, vars, subscribed and upsert
         * @param cb {Function} callback function accepting error, response and body
         * @type {Function}
         */
        create: function (listAddress, data, cb) {
          var last = arguments.length - 1;
          var callback = (arguments[last] && (typeof arguments[last] === 'function')) ? arguments[last] : Function;
          if (!data || (typeof data !== 'object')) {
            return callback(new Error('You must include data.'));
          }

          if (!listAddress || typeof listAddress !== 'string') {
            return callback(new Error('You must include mailing list address.'));
          }

          if (!data.address || typeof data.address !== 'string') {
            return callback(new Error('You must include member address.'));
          }

          var params = {};
          // prepare vars, has to be valid JSON
          if (data.vars && typeof data.vars === 'object') {
            for (var key in data) {
              params[key] = data[key];
            }
            params.vars = JSON.stringify(params.vars);
          }
          else {
            params = data;
          }

          return _post('/lists/' + listAddress + '/members', params, cb);
        },

        /**
         * Updates a mailing list member with given properties. Won’t touch the property if it’s not passed in.
         * @param listAddress {String} mailing list address
         * @param memberAddress {String} member address
         * @param data {Object} the object containing the address, name, vars, subscribed
         * @param cb {Function} callback function accepting error, response and body
         * @type {Function}
         */
        update: function (listAddress, memberAddress, data, cb) {
          var last = arguments.length - 1;
          var callback = (arguments[last] && (typeof arguments[last] === 'function')) ? arguments[last] : Function;

          if (!listAddress || typeof listAddress !== 'string') {
            return callback(new Error('You must include mailing list address.'));
          }

          if (!memberAddress || typeof memberAddress !== 'string') {
            return callback(new Error('You must include member address.'));
          }

          if (!data || (typeof data !== 'object')) {
            return callback(new Error('You must include data to update.'));
          }

          var params = {};
          // prepare vars, has to be valid JSON
          if (data.vars && typeof data.vars === 'object') {
            for (var key in data) {
              params[key] = data[key];
            }
            params.vars = JSON.stringify(params.vars);
          }
          else {
            params = data;
          }

          return _put('/lists/' + listAddress + '/members/' + memberAddress, params, cb);
        },

        /**
         * Delete a mailing list member.
         * @param listAddress {String} mailing list address
         * @param memberAddress {String} member address
         * @param cb {Function} callback function accepting error, response and body
         * @type {Function}
         */
        del: function (listAddress, memberAddress, cb) {
          var last = arguments.length - 1;
          var callback = (arguments[last] && (typeof arguments[last] === 'function')) ? arguments[last] : Function;
          if (!listAddress || typeof listAddress !== 'string') {
            return callback(new Error('You must include mailing list address.'));
          }

          if (!memberAddress || typeof memberAddress !== 'string') {
            return callback(new Error('You must include member address.'));
          }

          return _del('/lists/' + listAddress + '/members/' + memberAddress, cb);
        }
      }
    },

    domains: {
      /**
       * Returns a list of domains under your account.
       * @param data {Object} the optional object containing the GET options 'address', 'limit' and 'skip'
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      list: function (data, cb) {
        return _get('/domains', data, cb);
      },

      /**
       * Returns a single domain, including credentials and DNS records.
       * @param domain {String} the domain name
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      get: function (domain, cb) {
        if (!domain || typeof domain !== 'string') {
          return (cb || noop)(new Error('You must include domain name.'));
        }

        return _get('/domains/' + domain, cb);
      },

      /**
       * Create a new domain.
       * @param data {Object} the object containing the domain name, smtp_password, spam_action and wildcard.
       *                      name, smtp_password, and spam_action are string. wildcard boolean.
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      create: function (data, cb) {
        if (!data.name) {
          return (cb || noop)(new Error('You must include domain name.'));
        }

        if (!data.smtp_password) {
          return (cb || noop)(new Error('You must include SMTP password.'));
        }

        return _post('/domains', data, cb);
      },

      /**
       * Delete a domain from your account.
       * @param domain {String} domain name
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      del: function (domain, cb) {
        if (!domain || typeof domain !== 'string') {
          return (cb || noop)(new Error('You must include domain name.'));
        }

        return _del('/domains/' + domain, cb);
      }
    }
  };
};
