'use strict';
var bodyParser = require('body-parser');
var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var cookieParser = require('cookie-parser');
// var flash = require('connect-flash');
// var session = require('express-session');
// var log4js = require('log4js');
var app = module.exports = loopback();
const log = require('./utils/logHelper');
const searchIndex = require('search-index');
const https = require('https');
const http=require('http')
const sslConfig = require('./config/ssl-config');



log.use(app);
// configure view handler
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'));
// app.use(loopback.token());
// app.use(loopback.session({ secret: 'keyboard cat' }));

// =======log===================
// var log = require('log4js').getLogger('server');
// app.use(log4js.connectLogger(log4js.getLogger('http'), {level: 'auto'}));
// =======log end======================

// app.use(session({secret: 'simple',resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }}));
//
// app.use(cookieParser('simple'));
app.use(loopback.token());
// app.use(flash());//flash中间件
// 本地配置
app.locals.blog = {
  title: 'asd',
  description: 'ads',
};
app.middleware('initial', bodyParser.urlencoded({extended: true}));
require('./routes/routes')(app);





// https or http
app.start = (httpOnly) => {
  // if (!httpOnly) httpOnly = process.env.HTTP;
  let server = null;
  if (!httpOnly) {
    const options = {
      key: sslConfig.privateKey,
      cert: sslConfig.certificate,
    };
    server = https.createServer(options, app);
  } else {
    server = http.createServer(app);
  }

  // start the web server
  server.listen(app.get('port'), () => {
    app.emit('started');
  // var baseUrl = app.get('url').replace(/\/$/, '');
  const baseUrl = `${httpOnly ? 'http://' : 'https://'}${app.get('host')}:${app.get('port')}`;
  console.log('Web server listening at: %s', baseUrl);
  if (app.get('loopback-component-explorer')) {
    const explorerPath = app.get('loopback-component-explorer').mountPath;
    console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
  }
});

  return server;
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, (err) => {
  if (err) throw err;

// start the server if `$ node server.js`
if (require.main === module) {
  // search index
  searchIndex({}, (err1, si) => {
    if (err1) throw err1;
  app.si = si;
  // build search engine if totalDocs is 0
  app.models.Search.info_v1((err2, info) => {
    if (err2) throw err2;
else if (info.totalDocs === 0) {
    app.models.Search.build_v1((err3) => {
      if (err3) throw err3;
    console.log('Search Engine Build success');
  });
  }
});
  app.start('http');
  // app.start()
});
}
});


//
// process.on('uncaughtException', function(err) {
//   console.error('uncaughtException: %s', err, err.track);
// });

