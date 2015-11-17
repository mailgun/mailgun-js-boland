// taken from async

function noop() {
}

var _toString = Object.prototype.toString;

var _isArray = Array.isArray || function (obj) {
    return _toString.call(obj) === '[object Array]';
  };

function only_once(fn) {
  return function () {
    if (fn === null) throw new Error("Callback was already called.");
    fn.apply(this, arguments);
    fn = null;
  };
}

function _isArrayLike(arr) {
  return _isArray(arr) || (
      // has a positive integer length property
      typeof arr.length === "number" &&
      arr.length >= 0 &&
      arr.length % 1 === 0
    );
}

// Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
// This accumulates the arguments passed into an array, after a given index.
// From underscore.js (https://github.com/jashkenas/underscore/pull/2140).
function _restParam(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function () {
    var length = Math.max(arguments.length - startIndex, 0);
    var rest = new Array(length);
    for (var index = 0; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0:
        return func.call(this, rest);
      case 1:
        return func.call(this, arguments[0], rest);
    }
    // Currently unused but handle cases outside of the switch statement:
    // var args = Array(startIndex + 1);
    // for (index = 0; index < startIndex; index++) {
    //     args[index] = arguments[index];
    // }
    // args[startIndex] = rest;
    // return func.apply(this, args);
  };
}

function _parallel(eachfn, tasks, callback) {
  callback = callback || noop;
  var results = _isArrayLike(tasks) ? [] : {};

  eachfn(tasks, function (task, key, callback) {
    task(_restParam(function (err, args) {
      if (args.length <= 1) {
        args = args[0];
      }
      results[key] = args;
      callback(err);
    }));
  }, function (err) {
    callback(err, results);
  });
}

function series(tasks, callback) {
  _parallel(eachOfSeries, tasks, callback);
}

function _once(fn) {
  return function () {
    if (fn === null) return;
    fn.apply(this, arguments);
    fn = null;
  };
}

function _keyIterator(coll) {
  var i = -1;
  var len;
  var keys;
  if (_isArrayLike(coll)) {
    len = coll.length;
    return function next() {
      i++;
      return i < len ? i : null;
    };
  } else {
    keys = _keys(coll);
    len = keys.length;
    return function next() {
      i++;
      return i < len ? keys[i] : null;
    };
  }
}

// capture the global reference to guard against fakeTimer mocks
var _setImmediate = typeof setImmediate === 'function' && setImmediate;

var _delay = _setImmediate ? function (fn) {
  // not a direct alias for IE10 compatibility
  _setImmediate(fn);
} : function (fn) {
  setTimeout(fn, 0);
};

var nextTick;

if (typeof process === 'object' && typeof process.nextTick === 'function') {
  nextTick = process.nextTick;
} else {
  nextTick = _delay;
}

var setImmediate = _setImmediate ? _delay : nextTick;

function eachOfSeries(obj, iterator, callback) {
  callback = _once(callback || noop);
  obj = obj || [];
  var nextKey = _keyIterator(obj);
  var key = nextKey();

  function iterate() {
    var sync = true;
    if (key === null) {
      return callback(null);
    }
    iterator(obj[key], key, only_once(function (err) {
      if (err) {
        callback(err);
      }
      else {
        key = nextKey();
        if (key === null) {
          return callback(null);
        } else {
          if (sync) {
            setImmediate(iterate);
          } else {
            iterate();
          }
        }
      }
    }));
    sync = false;
  }

  iterate();
}

module.exports = function retry(times, task, callback) {
  var DEFAULT_TIMES = 5;
  var DEFAULT_INTERVAL = 0;

  var attempts = [];

  var opts = {
    times: DEFAULT_TIMES,
    interval: DEFAULT_INTERVAL
  };

  function parseTimes(acc, t) {
    if (typeof t === 'number') {
      acc.times = parseInt(t, 10) || DEFAULT_TIMES;
    } else if (typeof t === 'object') {
      acc.times = parseInt(t.times, 10) || DEFAULT_TIMES;
      acc.interval = parseInt(t.interval, 10) || DEFAULT_INTERVAL;
    } else {
      throw new Error('Unsupported argument type for \'times\': ' + typeof t);
    }
  }

  var length = arguments.length;
  if (length < 1 || length > 3) {
    throw new Error('Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)');
  } else if (length <= 2 && typeof times === 'function') {
    callback = task;
    task = times;
  }
  if (typeof times !== 'function') {
    parseTimes(opts, times);
  }
  opts.callback = callback;
  opts.task = task;

  function wrappedTask(wrappedCallback, wrappedResults) {
    function retryAttempt(task, finalAttempt) {
      return function (seriesCallback) {
        task(function (err, result) {
          seriesCallback(!err || finalAttempt, {err: err, result: result});
        }, wrappedResults);
      };
    }

    function retryInterval(interval) {
      return function (seriesCallback) {
        setTimeout(function () {
          seriesCallback(null);
        }, interval);
      };
    }

    while (opts.times) {

      var finalAttempt = !(opts.times -= 1);
      attempts.push(retryAttempt(opts.task, finalAttempt));
      if (!finalAttempt && opts.interval > 0) {
        attempts.push(retryInterval(opts.interval));
      }
    }

    series(attempts, function (done, data) {
      data = data[data.length - 1];
      (wrappedCallback || opts.callback)(data.err, data.result);
    });
  }

  // If a callback is passed, run this as a control flow
  return opts.callback ? wrappedTask() : wrappedTask;
};