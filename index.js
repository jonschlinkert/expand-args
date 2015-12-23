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
    if (utils.typeOf(orig) === 'object') {
      res[key] = expandArgs(orig);
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
            extend(res, utils.expand(ele, {
              toBoolean: true
            }));
          } else {
            res._ = res._ || [];
            res._.push(ele);
          }
        }
      }
      continue;
    }

    var val = orig.toString();
    if (/\w:\/\/\w/.test(val)) {
      res[key] = val;
      continue;
    }

    if ((/[\\\/]/.test(val) || /\/\./.test(val))) {
      if (/:/.test(val)) {
        res[key] = val.split('|').reduce(function(acc, ele) {
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
        res[key] = val.split('|').reduce(function(acc, ele) {
          var arr = ele.split('\\.').join('.').split(',');
          return acc.concat(arr);
        }, []);
        continue;
      }

      if (val.indexOf('./') === 0) {
        res[key] = val;
        continue;
      }
    }

    if (~key.indexOf(':') && val === 'true') {
      var parts = key.split(':');
      res[parts[0]] = parts[1];
      continue;
    }

    if (typeof orig === 'object' && key !== '_') {
      res[key] = expandArgs(orig);
      continue;
    }

    if (typeof orig === 'string' && /\W/.test(orig)) {
      res[key] = utils.expand(orig, {toBoolean: true});
      continue;
    }

    res[key] = orig;
  }
  res = normalize(res);
  return res;
}

function extend(a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a;
}

function normalize(argv) {
  for (var key in argv) {
    var val = argv[key];
    if (typeof val === 'string') {
      argv[key] = val.split('\\').join('');
    } else if (utils.typeOf(val) === 'object') {
      argv[key] = normalize(val);
    } else {
      argv[key] = val;
    }
  }
  return argv;
}

function expandEach(arr) {
  return arr.map(function(ele) {
    if (!/\W/.test(ele)) return ele;
    return utils.expand(ele, {
      toBoolean: true
    });
  });
}

/**
 * Expose an instance of `expandArgs` plugin
 */

module.exports = expandArgs;
