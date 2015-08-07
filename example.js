var expandArgs = require('./');
var minimist = require('minimist');
var argv = minimist(['--set=a:b,c:d']);
console.log(argv);
//=> { _: [], set: 'a:b,c:d' }
console.log(expandArgs(argv));
//=> { _: [], set: [{ a: 'b'}, {c: 'd'}] }
