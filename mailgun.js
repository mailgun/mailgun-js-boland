/*!
 * mailgun-js
 * Copyright(c) 2012, 2013 OneLobby <bojan@onelobby.com>
 * MIT Licensed
 */

var request = require('request');

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
  var protocol = 'https://';
  var host = 'api.mailgun.net';
  var endpoint = '/v2';

  var headers = {};
  var b = new Buffer([username, api_key].join(':'));
  headers['Authorization'] = "Basic " + b.toString('base64');

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

    var getDomain = function () {
      var d = '/' + domain;
      //filter out API calls that do not require a domain specified
      if ((resource.indexOf('routes') >= 0)
        || (resource.indexOf('lists') >= 0)) {
        d = '';
      }
      return d;
    };

    var url = '';
    url = url.concat(
      protocol,
      username, ':', api_key,
      '@',
      host,
      endpoint,
      getDomain(),
      resource);

    var opts = {
      url: url,
      method: method,
      headers: headers,
      agent: false
    };

    if (method === 'GET' || method === 'DELETE') {
      opts.qs = data;
    }
    else {
      opts.form = data;
    }

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

      return (cb || Function)(error, response, body);
    };

    return request(opts, responseCb);
  }

  function post(path, data, callback) {
    return _request('POST', path, data, callback);
  }

  function get(path, data, callback) {
    return _request('GET', path, data, callback);
  }

  function del(path, data, callback) {
    return _request('DELETE', path, data, callback);
  }

  function put(path, data, callback) {
    return _request('PUT', path, data, callback);
  }

  return {

    /**
     * Expose helper methods to allow users to interact with parts of the api that
     * are not exposed already.
     *
     * Example
     *  mailgun._get('/stats',function(err,stats){
     *    console.log(stats)
     *  })
     */
    _post : post,
    _get : get,
    _del : del,
    _put : put,

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
          return (cb || Function)(new Error('You must include a "to" parameter.'));
        }
        if (!data.from) {
          return (cb || Function)(new Error('You must include a "from" parameter.'));
        }
        if (!data.text && !data.html) {
          return (cb || Function)(new Error('You must include a "text" or "html" parameter.'));
        }

        return post('/messages', data, cb);
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
        return get('/mailboxes', data, cb);
      },

      /**
       * Creates a new mailbox associated with the mailgun account
       * @param data {Object} the object containing the new mailbox name ('mailbox') and new password ('password')
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      create: function (data, cb) {
        if (!data.mailbox) {
          return (cb || Function)(new Error('You must include name of the mailbox in the \'mailbox\' parameter.'));
        }
        if (!data.password) {
          return (cb || Function)(new Error('You must include a password for the new mailbox.'));
        }

        return post('/mailboxes', data, cb);
      },

      /**
       * Deletes a mailbox associated with the mailgun account
       * @param mailbox {String} the mailbox to be deleted
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      del: function (mailbox, cb) {
        if (!mailbox || typeof mailbox !== 'string') {
          return (cb || Function)(new Error('You must include name of the mailbox.'));
        }

        return del('/mailboxes/' + mailbox, cb);
      },

      /**
       * Updates the mailbox associated with the mailgun account
       * @param data {Object} the object containing the mailbox name ('mailbox') and new password ('password')
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      update: function (data, cb) {
        if (!data.mailbox) {
          return (cb || Function)(new Error('You must include name of the mailbox in the \'mailbox\' parameter.'));
        }
        if (!data.password) {
          return (cb || Function)(new Error('You must include a password for the mailbox.'));
        }

        var mailbox = data.mailbox;
        delete data.mailbox;

        return put('/mailboxes/' + mailbox, data, cb);
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
        return get('/routes', data, cb);
      },

      /**
       * Returns a single route object based on its ID.
       * @param id {String} the route ID
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      get: function (id, cb) {
        if (!id || typeof id !== 'string') {
          return (cb || Function)(new Error('You must include id of the route.'));
        }

        return get('/routes/' + id, cb);
      },

      /**
       * Creates a new route
       * @param data {Object} the object containing the priority, description, expression and action as strings
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      create: function (data, cb) {
        if (!data.expression) {
          return (cb || Function)(new Error('You must include route expression.'));
        }
        if (!data.action) {
          return (cb || Function)(new Error('You must include route action.'));
        }

        return post('/routes', data, cb);
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
          return (cb || Function)(new Error('You must include data.'));
        }

        if (!id || typeof id !== 'string') {
          return cb(new Error('You must include id of the route.'));
        }

        return put('/routes/' + id, data, cb);
      },

      /**
       * Deletes a route based on the id.
       * @param id {String} the id of the route to be deleted
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      del: function (id, cb) {
        if (!id || typeof id !== 'string') {
          return (cb || Function)(new Error('You must include the id of the route.'));
        }

        return del('/routes/' + id, cb);
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
        return get('/lists', data, cb);
      },

      /**
       * Returns a single mailing list by a given address.
       * @param address {String} the mailing list address
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      get: function (address, cb) {
        if (!address || typeof address !== 'string') {
          return (cb || Function)(new Error('You must include mailing list address.'));
        }

        return get('/lists/' + address, cb);
      },

      /**
       * Creates a new mailing list.
       * @param data {Object} the object containing the address, name, description, and access_level as strings
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      create: function (data, cb) {
        if (!data.address) {
          return (cb || Function)(new Error('You must include mailing list address.'));
        }

        return post('/lists', data, cb);
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
          return (cb || Function)(new Error('You must include data.'));
        }

        if (!address || typeof address !== 'string') {
          return (cb || Function)(new Error('You must include mailing list address.'));
        }

        return put('/lists/' + address, data, cb);
      },

      /**
       * Deletes a mailing list.
       * @param address {String} mailing list address
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      del: function (address, cb) {
        if (!address || typeof address !== 'string') {
          return (cb || Function)(new Error('You must include mailing list address.'));
        }

        return del('/lists/' + address, cb);
      },

      /**
       * Fetches mailing list stats.
       * @param address {String} mailing list address
       * @param cb {Function} callback function accepting error, response and body
       * @type {Function}
       */
      stats: function (address, cb) {
        if (!address || typeof address !== 'string') {
          return (cb || Function)(new Error('You must include mailing list address.'));
        }

        return get('/lists/' + address + '/stats', cb);
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

          return get('/lists/' + listAddress + '/members', data, cb);
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

          return get('/lists/' + listAddress + '/members/' + memberAddress, cb);
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

          return post('/lists/' + listAddress + '/members', params, cb);
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

          return put('/lists/' + listAddress + '/members/' + memberAddress, params, cb);
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

          return del('/lists/' + listAddress + '/members/' + memberAddress, cb);
        }
      }
    }
  };
};
