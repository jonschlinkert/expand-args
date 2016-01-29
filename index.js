/*!
 * expand-args <https://github.com/jonschlinkert/expand-args>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');
var sep = /[ =:]/;

function expand(argv) {
  var res = {};
  var segs;
  var val;
  var key;

  function merge(key, val) {
    if (key === '_') {
      utils.merge(res, val);
    } else {
      utils.set(res, key, val);
    }
  }

  for (key in argv) {
    if (argv.hasOwnProperty(key)) {
      val = argv[key];

      // '{'a b': true}'
      if (sep.test(key) && isBoolean(val)) {
        segs = key.split(sep);
        val = segs.pop();
        key = segs.join('.');
      }

      switch (utils.typeOf(val)) {
        case 'object':
          res[key] = expand(val);
          break;
        case 'string':
          if (~val.indexOf('|')) {
            val = val.split('|');
            utils.set(res, key, expandEach(val));
          } else if (isUrl(val)) {
            utils.set(res, key, expandString(val));
          } else if (~val.indexOf(',')) {
            val = expandString(val);
            if (Array.isArray(val) && hasObjects(val)) {
              val.forEach(function(ele) {
                merge(key, ele);
              });
            } else {
              merge(key, val);
            }
          } else {
            var str = key + ':' + val;
            segs = str.split(sep);
            val = segs.pop();
            key = segs.join('.');
            utils.set(res, key, expandString(val));
          }
          break;
        case 'array':
          if (hasObjects(val)) {
            merge(key, expandEach(val));
          } else {
            res[key] = val;
          }
          break;
        case 'boolean':
        default: {
          res[key] = val;
          break;
        }
      }
    }
  }
  return res;
}

function expandString(val) {
  if (isUrl(val)) {
    return val;
  }

  if (isPath(val)) {
    val = unescape(val);
    if (~val.indexOf(':')) {
      return toObject(val);
    }
    if (~val.indexOf(',')) {
      return val.split(',');
    }
    return val;
  }

  if (!/\W/.test(val)) {
    return val;
  }

  return utils.expand(val, {
    toBoolean: true
  });
}

function expandEach(arr) {
  var len = arr.length;
  var idx = -1;
  var res = {};
  while (++idx < len) {
    utils.merge(res, expand(utils.expand(arr[idx], {toBoolean: true})));
  }
  return res;
}

function isBoolean(val) {
  return val === 'false'
    || val === 'true'
    || val === false
    || val === true;
}

function isUrl(val) {
  return /\w:\/\/\w/.test(val);
}

function isPath(val) {
  return /(?:[\\\/]|\\\.)/.test(val);
}

function unescape(val) {
  if (isString(val)) {
    return val.split('\\').join('');
  }
  if (isObject(val)) {
    for (var key in val) {
      val[key] = unescape(val[key]);
    }
    return val;
  }
  if (Array.isArray(val)) {
    return val.map(unescape);
  }
  return val;
}

function isString(val) {
  return typeof val === 'string';
}

function isObject(val) {
  return utils.typeOf(val) === 'object';
}

function toObject(str) {
  var res = {};
  var segs = str.split(':');
  var val = segs.pop();
  res[segs.join('.')] = val;
  return res;
}

function hasObjects(arr) {
  var len = arr.length;
  var idx = -1;

  while (++idx < len) {
    if (isObject(arr[idx]) || /[:=|,]/.test(arr[idx])) {
      return true;
    }
  }
  return false;
}

/**
 * Expose `expand`
 */

module.exports = expand;
