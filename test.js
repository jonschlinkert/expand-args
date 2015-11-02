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

  it('should expand args to array values:', function () {
    expand({set: 'a:b,c:d'}).should.eql({set: [{a: 'b'}, {c: 'd'}]});
    expand({set: 'a.b.c:d,e,f'}).should.eql({set: {a: {b: {c: ['d', 'e', 'f']}}}});
  });

  //  path: 'a.b:d\\.js|cwd:fixtures|z:a,b,c' }
  it('should work with file paths:', function () {
    expand({path: 'a.b:d\\.js' }).should.eql({path: {a: {b: 'd.js'}}});
    expand({path: 'cwd:a/b/c/d/e\\.js' }).should.eql({path: {cwd: 'a/b/c/d/e.js'}});
    expand({path: 'a\\.js,b\\.js,c\\.js' }).should.eql({path: ['a.js', 'b.js', 'c.js']});
    expand({path: 'a.b:foo/bar/baz/d\\.js' }).should.eql({path: {a: {b: 'foo/bar/baz/d.js'}}});
    expand({path: 'a.b:d\\.js|x.y:z' }).should.eql({path: {a: {b: 'd.js'}, x: {y: 'z'}}});
  });

  it('should fix object args mistakenly set as booleans:', function () {
    expand({'a:b': true}).should.eql({a: 'b'});
  });
});

describe('_', function () {
  it('should ignore non-opts that have string values:', function () {
    expand({_: ['a', 'b']}).should.eql({_: ['a', 'b']});
  });
});
