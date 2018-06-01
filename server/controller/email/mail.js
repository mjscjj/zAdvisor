/**
 *
 * @Description 邮件发送
 * 调用方法:sendMail('amor_zhang@qq.com','这是测试邮件', 'Hi Amor,这是一封测试邮件');
 * @Author Amor
 * @Create
 *
 */
const logger = require('../../utils/logHelper').helper;
const fs=require('fs')
const  email=require('../../config/zConfig').zconfig.zemail
var nodemailer = require('nodemailer')
// var smtpTransport = require('nodemailer-smtp-transport');

let smtpTransport = nodemailer.createTransport(
  {
    host: email.host,
    // host: 'd23ml028.cn.ibm.com',
    port: email.port,
    secure: email.secure,
    secureConnection: false,
    authMethod: 'CRAM-MD5',
    tls: {rejectUnauthorized: false},
    startTLS: true,
    logger: false,
    debug: false, // include SMTP traffic in the logs
  }
  // ,
  // {
  //   // authMethod: 'CRAM-MD5',
  //   // default message fields
  //   // sender info
  //   from: 'chujiejei <cjjchu@cn.ibm.com>',
  //   // headers: {
  //   //   'X-Laziness-level': 1000, // just an example header, no need to use this
  //   // },
  // }
);
/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail = function (recipient, subject, html,filename,filePath,callbackall) {
  if(filename!=null&&filePath!=null){
    smtpTransport.sendMail({
      from: email.fromName+'<'+email.user+'>',
      to: recipient,
      subject: subject,
      html: html,
      attachments:[
        {
          filename:filename,
          path: filePath
        },
      ]
    }, function (error, response) {
      if (error) {
        callbackall(error)
        return
      }
      callbackall(null,response)

    });
  }else {
    smtpTransport.sendMail({
      from: email.fromName+'<'+email.user+'>',
      to: recipient,
      subject: subject,
      html: html,
    }, function (error, response) {
      if (error) {
        callbackall(error)
        return
      }
      callbackall(null,response)
    });
  }

  smtpTransport.close()
}
var sendMailByFileContent = function (recipient, subject,html,filename,content,callbackall) {
  if(filename!=null&&content!=null){
    smtpTransport.sendMail({
      from: email.fromName+'<'+email.user+'>',
      to: recipient,
      subject: subject,
      html: html,
      attachments:[
        {
          filename:filename,
          content: content
        }
      ]
    }, function (error, response) {
      if (error) {
        callbackall(error)
        return
      }
      callbackall(null,response)

    });
  }else {
    smtpTransport.sendMail({
      from: email.fromName+'<'+email.user+'>',
      to: recipient,
      subject: subject,
      html: html,
    }, function (error, response) {
      if (error) {
        callbackall(error)
        return
      }
      callbackall(null,response)
    });
  }

  smtpTransport.close()
}


// {   // utf-8 string as an attachment
//   filename: 'text1.txt',
//     content: 'hello world!'
// }
exports.sendMailByFilePath = sendMail;
exports.sendMailByFileContent=sendMailByFileContent;
// sendMail('1044055912@qq.com','这是测试邮件', 'test2',null,null,function (err,resu) {
//   console.log("end")
//   if(err){console.log(err);return }else {
//     console.log(resu)
//   }
// });
// sendMailByFileContent('1044055912@qq.com','这是测试邮件', 'test2',"12","123213",function (err,resu) {
//   console.log("end")
//   if(err){console.log(err);return }else {
//     console.log(resu)
//   }
// });
