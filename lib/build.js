var inflection = require('inflection');
var pathProxy = require('path-proxy');
var promisifyCall = require('promisify-call');

var noop = function () {
};

var Builder = function (baseObj, resources) {
  this.baseObj = baseObj;
  this.resources = resources;
};

Builder.prototype.build = function () {
  var self = this;
  Object.keys(this.resources).forEach(function (key) {
    //console.log('building ' + key);
    self.buildResource(self.resources[key]);
  });
};

Builder.prototype.buildResource = function (resource) {
  resource.links.forEach(this.buildAction, this);
};

Builder.prototype.buildAction = function (action) {
  var actionName = action.title;
  var properties = action.properties;
  var requiredProps = action.required;

  // HACKY special case for members bulk add and send MIME endpoints
  var path = action.href.replace(/\.json/gi, '').replace(/\.mime/gi, '');
  var constructor = pathProxy.pathProxy(this.baseObj, path);

  function impl (data, fn) {
    var requestPath = action.href;
    var pathParams = action.href.match(/{[^}]+}/g) || [];

    if (typeof data === 'function') {
      fn = data;
      data = undefined;
    }

    var err;

    if (this.params.length !== pathParams.length) {
      err = new Error('Invalid number of params in path (expected ' + pathParams.length + ', got ' + this.params.length + ').');
      return fn(err);
    }

    this.params.forEach(function (param) {
      requestPath = requestPath.replace(/{[^}]+}/, param);
    });

    // check required payload properties
    if (requiredProps && requiredProps.length > 0) {
      if (!data) {
        err = new Error('Missing parameters.');
      }
      else {
        for (var i = 0; i < requiredProps.length; i++) {
          var prop = requiredProps[i];
          if (typeof data[prop] === 'undefined') {
            err = new Error('Missing parameter \'' + prop + '\'');
            break;
          }
        }
      }
    }

    if (err) {
      return fn(err);
    }

    // check payload property types
    for (var key in properties) {
      if (data && data[key]) {
        var type = properties[key].type;
        var dataType = Array.isArray(data[key]) ? 'array' : typeof data[key];
        if (Array.isArray(type)) {
          if (type.indexOf(dataType) === -1) {
            err = new Error('Invalid parameter type. ' + key + ' must be of type: ' + type + '.');
            break;
          }
        }
        else if (dataType !== type) {
          err = new Error('Invalid parameter type. ' + key + ' must be of type: ' + type + '.');
          break;
        }
      }
    }

    if (err) {
      return fn(err);
    }

    this.client = this.base;
    return this.client.request(action.method, requestPath, data, fn);
  }

  constructor.prototype[getName(actionName)] = function (data, fn) {
    return promisifyCall(this, impl, data, fn);
  };
};

function getName(name) {
  name = name.toLowerCase();
  name = inflection.dasherize(name).replace(/-/g, '_');
  name = inflection.camelize(name, true);

  return name;
}

exports.build = function (baseObj, resources) {
  var b = new Builder(baseObj, resources);
  b.build();
};
