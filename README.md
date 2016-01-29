# expand-args [![NPM version](https://img.shields.io/npm/v/expand-args.svg)](https://www.npmjs.com/package/expand-args) [![Build Status](https://img.shields.io/travis/jonschlinkert/expand-args.svg)](https://travis-ci.org/jonschlinkert/expand-args)

> Expand parsed command line arguments using expand-object.

**Example**

```js
var minimist = require('minimist');
var expandArgs = require('expand-args');

var argv = minimist(['--set=a:b,c:d']);
//=> { _: [], set: 'a:b,c:d' }

expandArgs(argv);
//=> { _: [], set: [{ a: 'b' }, { c: 'd' }] }
```

Visit [expand-object](https://github.com/jonschlinkert/expand-object) to see the full range of options and features or to create expansion-related issues.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm i expand-args --save
```

## Usage

```js
var expandArgs = require('expand-args');
```

### expand args to object values

```js
expandArgs({set: 'a:b'})
//=> {set: {a: 'b'}}

expandArgs({set: 'a.b.c:d'})
//=> {set: {a: {b: {c: 'd'}}}}
```

### expand args to array values

```js
expandArgs({set: 'a:b,c:d'})
//=> {set: [{a: 'b'}, {c: 'd'}]}

expandArgs({set: 'a.b.c:d,e,f'})
//=> {set: {a: {b: {c: ['d', 'e', 'f']}}}}
```

### Convert "object-keys"

```js
expandArgs({'a:b': true})
//=> {a: 'b'}
```

### Expand booleans

```js
expandArgs({set: 'a|b'});
//=> {set: {a: true, b: true}}
```

## Related projects

* [expand-object](https://www.npmjs.com/package/expand-object): Expand a string into a JavaScript object using a simple notation. Use the CLI or… [more](https://www.npmjs.com/package/expand-object) | [homepage](https://github.com/jonschlinkert/expand-object)
* [map-config](https://www.npmjs.com/package/map-config): Map configuration objects to application methods. | [homepage](https://github.com/doowb/map-config)

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/expand-args/issues/new).

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016 [Jon Schlinkert](https://github.com/jonschlinkert)
Released under the MIT license.

***

_This file was generated by [verb](https://github.com/verbose/verb) on January 29, 2016._