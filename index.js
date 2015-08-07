/*!
 * expand-args <https://github.com/jonschlinkert/expand-args>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var extend = require('extend-shallow');
var expand = require('expand-object');

function Expander(argv) {
  this.argv = argv || {};
}

Expander.prototype.splitOpts = function(argv) {
  argv = argv || this.argv;
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

    if (Array.isArray(orig) && key !== '_') {
      res[key] = orig.map(expand);
      continue;
    }

    if (typeof orig === 'object' && key !== '_') {
      res[key] = this.splitOpts(orig);
      continue;
    }

    if (~val.indexOf(':')) {
      res[key] = expand(val);
      continue;
    }

    res[key] = orig;
  }

  this.argv = res;
  return res;
};

Expander.prototype.splitArgs = function(argv) {
  argv = argv || this.argv;
  var arr = (argv._ || []).slice(0);
  var len = arr.length, i = -1;
  var num = -1;
  while (++i < len) {
    var arg = arr[i];
    var val = arg.split(':');
    if (val.length > 1) {
      argv[val[0]] = val[1];
      argv._.splice(i - (++num), 1);
    }
  }
  return argv;
};

Expander.prototype.expand = function(argv) {
  this.splitArgs(argv);
  this.splitOpts(argv);
  return this.argv;
};

/**
 * Expose an instance of `Expander`
 */

module.exports = function (argv) {
  var expander = new Expander();
  return expander.expand(argv);
};

/**
 * Expose an the `Expander` constructor
 */

module.exports.Expander = Expander;
