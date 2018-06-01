// child.js
const fs=require("fs")

console.log('child argv: ', 'MJSCJj');

process.stdin.pipe(process.stdout);

console.log(process.stdin)
