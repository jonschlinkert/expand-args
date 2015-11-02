/*!
 * expand-args <https://github.com/jonschlinkert/expand-args>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

function expandArgs(argv) {
  var res = {};

  for (var key in argv) {
    if (!argv.hasOwnProperty(key)) {
      continue;
    }

    var orig = argv[key];
    if (typeof orig === 'string') {
      orig = orig.split('/').join('__SLASH__');
    }

    if (utils.typeOf(orig) === 'object') {
      res[key] = expandArgs(orig);
      continue;
    }

    var val = orig.toString();

    if ((/[\\\/]/.test(val) || /\/\./.test(val))) {
      if (/:/.test(val)) {
        res[key] = emit(val).split('|').reduce(function (acc, ele) {
          var o = {};
          var segs = ele.split(':');
          var v = segs[1].split('\\.').join('.');
          if (/,/.test(v)) {
            v = v.split(',');
          }
          utils.set(o, segs[0], v);
          extend(acc, o);
          return acc;
        }, {});
        continue;
      }

      if (/,/.test(val)) {
        res[key] = emit(val).split('|').reduce(function (acc, ele) {
          var arr = ele.split('\\.').join('.').split(',');
          return acc.concat(arr);
        }, []);
        continue;
      }

      if (val.indexOf('./') === 0) {
        res[key] = emit(val);
        continue;
      }
    }

    if (~key.indexOf(':') && val === 'true') {
      var parts = key.split(':');
      res[parts[0]] = emit(parts[1]);
      continue;
    }

    if (Array.isArray(orig)) {
      if (key !== '_') {
        res[key] = expandEach(orig);
        continue;
      } else {
        var len = orig.length, i = -1;
        while (++i < len) {
          var ele = orig[i];
          if (/\W/.test(ele)) {
            extend(res, utils.expand(ele));
          } else {
            res._ = res._ || [];
            res._.push(emit(ele));
          }
        }
      }
      continue;
    }

    if (typeof orig === 'object' && key !== '_') {
      res[key] = expandArgs(orig);
      continue;
    }

    if (typeof orig === 'string' && /\W/.test(orig)) {
      res[key] = utils.expand(emit(orig), {toBoolean: true});
      continue;
    }

    res[key] = emit(orig);
  }
  return res;
}

function extend(a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a;
}

function expandEach(arr) {
  return arr.map(function (ele) {
    ele = emit(ele);

    if (!/\W/.test(ele)) return ele;
    return utils.expand(ele, {
      toBoolean: true
    });
  });
}

function emit(str) {
  str = str.split('__SLASH__').join('/');
  return str;
}

/**
 * Expose an instance of `expandArgs` plugin
 */

module.exports = expandArgs;
