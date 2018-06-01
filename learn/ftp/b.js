// var path = require('path');
// var fs = require('fs');
// var Promise = require('bluebird');
// var Client = require('ftp');
//
// var c = new Client();
//
//
//
// c.on('ready', function () {
//   console.log('ready');
//   c.list(function (err, list) {
//     if (err) throw err;
//     list.forEach(function (element, index, array) {
//       //Ignore directories
//       if (element.type === 'd') {
//         console.log('ignoring directory ' + element.name);
//         return;
//       }
//       //Ignore non zips
//       if (path.extname(element.name) !== '.zip') {
//         console.log("zip")
//         console.log('ignoring file ' + element.name);
//         return;
//       }
//       //Download files
//       c.get(element.name, function (err, stream) {
//         if (err) throw err;
//         stream.once('close', function () {
//           c.end();
//         });
//         stream.pipe(fs.createWriteStream(element.name));
//       });
//     });
//   });
// });
//
// c.connect({host: 'testcase.software.ibm.com'});
