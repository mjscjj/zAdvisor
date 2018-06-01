var https = require('https');
var zlib = require('zlib');
var eamil = require('../../controller/email/mail.js').sendMail;
const app = require('../../server');

var getAPI = function () {
  var options = {
    //https://zadvisor.mybluemix.net
    // hostname: '127.0.0.1',
    // port: '3000',
    hostname: 'zadvisort.mybluemix.net',
    path: '/api/Emails/v2/transit_eamil_v2',
    method: 'POST',
    rejectUnauthorized: false,
    requestCert: false,
    auth: '?access_token=tMVJ2DULgy762LXC2qSWFu2jDzzBUciMV5WiEkD&zadmin=123',
    headers: {
      'zadmin': '123',
      'password': '123',
      'Cookie': 'locale=zh_CN',
      'X-BuildTime': '2015-01-01 20:04:11',
      'Autologin': '4',
      'Accept-Encoding': 'gzip, deflate',
      'X-Timeout': '3600000',
      'Content-Type': 'Application/json',
    },
  };
  var req = https.request(options, function (res) {
    // console.log('Status:', res.statusCode);
    // console.log('headers:', JSON.stringify(res.headers));
    res.setEncoding('utf-8');
    let chunk = "";
    res.on('data', function (chun) {
      chunk += chun;
    });
    res.on('end', function (err, data) {
      console.log("sen end")
      if (chunk.length > 1) {
        console.log(chunk)
        em = JSON.parse(chunk);
        eamil(em.toEmail, '这是测试邮件', 'veriyCode:'+em.veriyCode, em.fileName, em.filePath, function (err, resu) {
          console.log("end")
          if (err) {
            console.log(err);
            return
          } else {
            console.log(resu)
          }
        });

      }
    })
  });

  req.on('error', function (e) {
    console.log(new Error('problem with request: ' + e.message));
    req.end();
  });
  req.end();
}

var startSendEmail=function () {
  setInterval(function (err,data) {
    console.log("1")
    getAPI()
  },1500)
}


// startSendEmail()
