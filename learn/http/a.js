// var https = require('https');
// var zlib = require('zlib');
//
// var post_data="………………";//请求数据
// var reqdata = JSON.stringify(post_data);
// var options = {
//   hostname: '10.225.***.***',
//   port: '8443',
//   path: '/data/table/list',
//   method: 'POST',
//   rejectUnauthorized: false,
//   requestCert: true,
//   auth: 'admin:123456************',
//   headers: {
//     'username': 'admin',
//     'password': '123456************',
//     'Cookie': 'locale=zh_CN',
//     'X-BuildTime': '2015-01-01 20:04:11',
//     'Autologin': '4',
//     'Accept-Encoding': 'gzip, deflate',
//     'X-Timeout': '3600000',
//     'Content-Type': 'Application/json',
//     "Content-Length":reqdata.length
//   }
// };
// var req = https.request(options, function (res) {
// });
// req.write(reqdata);
// req.on('response', function (response) {
//   switch (response.headers['content-encoding']) {
//     case 'gzip':
//       var body = '';
//       var gunzip = zlib.createGunzip();
//       response.pipe(gunzip);
//       gunzip.on('data', function (data) {
//         body += data;
//       });
//       gunzip.on('end', function () {
//         var returndatatojson= JSON.parse(body);
//         req.end();
//       });
//       gunzip.on('error', function (e) {
//         console.log('error' + e.toString());
//         req.end();
//       });
//       break;
//     case 'deflate':
//       var output = fs.createWriteStream("d:temp.txt");
//       response.pipe(zlib.createInflate()).pipe(output);
//       req.end();
//       break;
//     default:req.end();
//       break;
//   }
// });
// req.on('error', function (e) {
//   console.log(new Error('problem with request: ' + e.message));
//   req.end();
//   setTimeout(cb, 10);
// });
