'use strict';

require('mocha');
var argv = require('minimist')(process.argv.slice(2));
var assert = require('assert');
var should = require('should');
var expand = require('./');

describe('expand', function () {
  it('should expand args to object values:', function () {
    expand({set: 'a|b'}).should.eql({set: {a: true, b: true}});
    expand({set: 'a:b'}).should.eql({set: {a: 'b'}});
    expand({set: 'a.b.c:d'}).should.eql({set: {a: {b: {c: 'd'}}}});
  });

  it('should move non-options args with object values to options:', function () {
    expand({_: ['a|b']}).should.eql({a: true, b: true});
  });

  it('should not expand url values:', function () {
    expand({foo: 'http://foo/bar.baz'}).should.eql({foo: 'http://foo/bar.baz'});
  });

  it('should expand args with file paths:', function () {
    var a = expand({path: 'foo:/a/b/c' });
    a.should.eql({path: {foo: '/a/b/c'}});

    var b = expand({_: ['a.b:d\\.js|cwd:fixtures|z:a,b,c'] });
    b.should.eql({a: {b: 'd.js'}, cwd: 'fixtures', z: ['a', 'b', 'c']});
  });

  it('should respect escaped dots:', function () {
    expand({path: 'a.b:d\\.js' }).should.eql({path: {a: {b: 'd.js'}}});
    expand({path: 'cwd:a/b/c/d/e\\.js' }).should.eql({path: {cwd: 'a/b/c/d/e.js'}});
    expand({path: 'a\\.js,b\\.js,c\\.js' }).should.eql({path: ['a.js', 'b.js', 'c.js']});
    expand({path: 'a.b:foo/bar/baz/d\\.js' }).should.eql({path: {a: {b: 'foo/bar/baz/d.js'}}});
    expand({path: 'a.b:d\\.js|x.y:z' }).should.eql({path: {a: {b: 'd.js'}, x: {y: 'z'}}});
  });
});

describe('arrays', function () {
  it('should expand args to array values:', function () {
    expand({set: 'a.b.c:d,e,f'}).should.eql({set: {a: {b: {c: ['d', 'e', 'f']}}}});
  });

  it('should merge array args when each arg is an object:', function () {
    expand({one: [ 'a:b', 'c:d' ]}).should.eql({one: {a: 'b', c: 'd'}});
    expand({one: [ 'a:b', 'c:d' ]}).should.eql({one: {a: 'b', c: 'd'}});
    expand({one: [ 'a:b', 'c:d'], two: ['foo']}).should.eql({one: {a: 'b', c: 'd'}, two: ['foo']});
    expand({set: 'a:b,c:d'}).should.eql({set: {a: 'b', c: 'd'}});
  });
});

describe('_', function () {
  it('should convert key-value-keys to key-value object:', function () {
    // minimist (correctly) creates an object with a boolean value,
    // we want to convert this to an object
    expand({'a:b': true}).should.eql({a: 'b'});
    expand({'_': ['a:b']}).should.eql({a: 'b'});
  });

  it('should move key-value strings from non-options array to flags', function () {
    expand({'_': ['a:b']}).should.eql({a: 'b'});
  });
  it('should ignore non-opts that have string values:', function () {
    expand({_: ['a', 'b']}).should.eql({_: ['a', 'b']});
  });
});
