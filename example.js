var expandArgs = require('./');
var minimist = require('minimist');
// var argv = minimist(['--set=a:b,c:d']);
// console.log(argv);
// //=> { _: [], set: 'a:b,c:d' }
// console.log(expandArgs(argv));
// //=> { _: [], set: [{ a: 'b'}, {c: 'd'}] }

var argv = minimist(process.argv.slice(2));
console.log(expandArgs(argv));
