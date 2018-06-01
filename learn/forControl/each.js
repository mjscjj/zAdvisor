
var async=require('async')

var openFiles=[1,2,3,4,5,6,7]


async.each(openFiles, function(i, callback) {
        console.log(i)
  callback()

}, function(err) {

console.log('done')

});
