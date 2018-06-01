var Client = require('ftp');
var fs = require('fs');
var log = require('log4js').getLogger('ftpaction');
const async = require('async');

function fromftp(req, res) {
  var c = new Client();
  c.connect({host: 'testcase.software.ibm.com', user: 'cjjchu@cn.ibm.com', password: 'ab323637'});
  console.log('===========  ftp  ====================');
  c.on('ready', function() {
    console.log('ftp server ocnnected --from');
    var tmp_path = req.files.uploadfile.path;
    c.cwd('/toibm/im', function(err, d) {
      if (err) {
        console.log(err);
        return;
      }
      c.put(tmp_path, '0000' + req.files.uploadfile.originalFilename, function(err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('uoload success');
        fs.unlink(tmp_path, function(err) {
          if (err) {
            console.log('删除文件错误:' + err);
            return;
          }
          c.end();
          res.redirect('/ftpresult');
        });
      });
    });
  });
  c.on('end', function() {
    console.log('ftp connection close --form');
    console.log(req.files);
  });
}

var listftp = function(req, res) {
  var c = new Client();
  let reaarr = [];
  c.connect({host: 'testcase.software.ibm.com', user: 'cjjchu@cn.ibm.com', password: 'ab323637'});
  c.on('ready', function() {
    console.log('ftp server connected  --list');
    c.cwd('/toibm/im', function(err, list) {
      if (err) return err;
      c.list(function(err, list) {
        if (err) return err;
        list.forEach(function(ele, index, arr) {
          reaarr.push(ele.name);
        });
        c.end();
        console.log('render');
        res.render('ftpresult_', {result: reaarr, message: 'success'});
      });
    });
  });
  c.on('close', function() {
    console.log('ftp server disconnected --list');
  });
};

var down = function(req, res) {
  var c = new Client();
  c.connect({host: 'testcase.software.ibm.com', user: 'cjjchu@cn.ibm.com', password: 'ab323637'});
  var name = req.query.filename;
  c.on('ready', function() {
    console.log('ftp server connected --down');
    c.get('/toibm/im/' + name, function(err, stream) {
      stream.on('close', function() {
        c.end();
        res.end('download file in folder /server/public/file/');
      });
      stream.pipe(fs.createWriteStream('./server/public/file/' + name));
    });
  });
  c.on('close', function() {
    console.log('ftp server disconnected --dowm');
  });
};

function ftpdelete(req,res) {
  var c = new Client();
  c.connect({host: 'testcase.software.ibm.com', user: 'cjjchu@cn.ibm.com', password: 'ab323637'});
  var name = req.query.filename;
  c.on('ready', function() {
    console.log('ftp server connected --delete');
    c.delete('/toibm/im/' + name, function(err) {
      if (err) { console.log(err); return; }
      res.end('delete success')
    });
  });
  c.on('close', function() {
    console.log('ftp server disconnected --delete');
  });
}

exports.listftp = listftp;
exports.fromftp = fromftp;
exports.down = down;
exports.ftpdelete = ftpdelete;
