var Client = require('ftp');
var fs = require('fs');
var c = new Client();
// c.connect({host: 'testcase.software.ibm.com', user: 'cjjchu@cn.ibm.com', password: 'ab323637'});
c.connect({host: 'stlmvs1.svl.ibm.com', user: 'caomz', password: 'cmz45678'});

c.on('ready', function() {
  console.log('ftp server connect cuccess');
  c.pwd(function(err, data) {
    console.log(data);
  });
  c.cwd('..', function(err, data) {
    c.pwd(function(err, data) {
      console.log(data);
      c.get('DB2DUMP.SIMPMOD.SPA.DATA', function(err, stream) {
        console.log(JSON.stringify(stream));
        console.log(err);
        stream.on('close', function() {
          c.end();
           // res.end('download file in folder /server/public/file/');
        });
        stream.pipe(fs.createWriteStream('./testfile.txt'));
      });
    });
  });
  c.end();
});

c.on('end', function() {
  console.log('ftp connection close');
});
