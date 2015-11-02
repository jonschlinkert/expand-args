'use strict';

/**
 * Lazily-required module dependencies (makes the application
 * faster)
 */

var utils = require('lazy-cache')(require);

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into recognizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('expand-object', 'expand');
require('extend-shallow', 'extend');
require('kind-of', 'typeOf');
require('set-value', 'set');

/**
 * Restore `require`
 */

require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
