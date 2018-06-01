'use strict';
var fs=require('fs')
var path=require('path')
const passport = require('../passport');
const app = require('../server');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: './server/public/tmp'});
const logger = require('../../server/utils/logHelper').helper;

module.exports = (server) => {
  // initialize for express
  app.use(passport.initialize());
  // passport session for express
  // app.use(passport.session());
  // Install a `/` route that returns server status
  const router = server.loopback.Router();

  router.get('/', server.loopback.status());
  // app routes
  router.get('/auth/sso/callback',
    // let redirect_url = req.session.originalUrl;
    passport.authenticate('openidconnect', {
      // successRedirect: '/auth/success',
      session: false,
      failureRedirect: '/auth/failure',
    }),
    (req, res) => {
      // res.send(req.user);
      if (req.user) {
        res.append('Access-Token', req.user.accessToken);
        res.append('UserEmail', req.user.email);
      }
      res.send({
        'Access-Token': req.user.accessToken,
      });
    });

  router.get('/auth/failure', (req, res) => {
    res.status(400).send('Login Failure');
  });

  router.get('/api/accounts/v1/login', passport.authenticate('openidconnect', {
    session: false,
  }));

  router.get('/zadmin', function(req, res, next) {
    // 显示服务器文件
    // 文件目录
    var filePath = path.join(__dirname, '../../logs');
    fs.readdir(filePath, function(err, results){
      if(err) throw err;
      if(results.length>0) {
        var files = [];
        results.forEach(function(file){
          if(fs.statSync(path.join(filePath, file)).isFile()){
            files.push(file);
          }
        })
        res.render('admin', {files:files});
      } else {
        res.end('当前目录下没有文件');
      }
    });
  });

  router.get('/file/:fileName', function(req, res, next) {
    // 实现文件下载
    var fileName = req.params.fileName;
    var filePath = path.join(__dirname,'../../logs', fileName);
    var stats = fs.statSync(filePath);
    if(stats.isFile()){
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename='+fileName,
        'Content-Length': stats.size
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.end(404);
    }
  });
  router.get('/config',function(req, res, next) {
    // 实现文件下载
    var fileName = req.params.fileName;
    fileName='zConfig.js'
    var filePath = path.join(__dirname,'../config/zConfig.js');
    var stats = fs.statSync(filePath);
    if(stats.isFile()){
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename='+fileName,
        'Content-Length': stats.size
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.end(404);
    }
  });
  router.use('/configload', multipartMiddleware, function (req,res) {
    // console.log(req.files)
    if(req.files.file.originalFilename!='zConfig.js'){
      res.end('file name illegal');
      return
    }
    fs.readFile(req.files.file.path, function (err, data) {
     var time= new Date().toDateString()
      fs.writeFile('./logs/zConfigBackup'+time, data, function (err) {
        if( err ){
          console.log( err );
          return
        }else{
        }
      });
      fs.writeFile('./server/config/zConfig.js', data, function (err) {
        if( err ){
          console.log( err );
        }else{
            var  response = {
            message:'File uploaded successfully',
            filename:req.files.file.originalFilename
          };
        }
        console.log( response );
        logger.writeInfo("config:"+data.toString())
        res.end(JSON.stringify( response ) );
      });
    });
  });



  server.use(router);
};
