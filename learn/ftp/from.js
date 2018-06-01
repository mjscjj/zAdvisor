var Client = require('ftp');
var fs = require('fs');
var c = new Client();
c.connect({host: 'testcase.software.ibm.com'});
c.on('ready', function () {
  console.log('ftp server connect cuccess');
  c.list(function (err, list) {
   list.forEach(function (eles) {
     if(eles.type==='d'){
       console.log(eles)
       // console.log(dir)
     }
   })

  })


  c.end()
});

c.on('end', function () {
  console.log('ftp connection close');
});
