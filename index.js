/*!
 * expand-args <https://github.com/jonschlinkert/expand-args>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var expand = require('expand-object');

function expandArgs(argv) {
  var res = {};

  for (var key in argv) {
    if (!argv.hasOwnProperty(key)) {
      continue;
    }

    var orig = argv[key];
    var val = orig.toString();

    if (~key.indexOf(':') && val === 'true') {
      var parts = key.split(':');
      res[parts[0]] = parts[1];
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
            extend(res, expand(ele));
          } else {
            res._ = res._ || [];
            res._.push(ele);
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
      res[key] = expand(orig, {toBoolean: true});
      continue;
    }

    res[key] = orig;
  }
  return res;
}

function extend(a, b) {
  for (var key in b) a[key] = b[key];
  return a;
};

function expandEach(arr) {
  return arr.map(function (ele) {
    if (!/\W/.test(ele)) return ele;
    return expand(ele, {toBoolean: true});
  });
}

/**
 * Expose an instance of `expandArgs` plugin
 */

module.exports = expandArgs;
