'use strict';

let mailConfig = require('../../mailConfig').mailFeature;
const nodemailer = require('nodemailer');

let mail = function(sendto, filePath, rel, sub, callback) {
  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport(
    {
      host: mailConfig.host,
      // host: 'd23ml028.cn.ibm.com',
      // host: 'ap.relay.ibm.com',
      port: mailConfig.port,
      secure: mailConfig.secure,
      secureConnection: mailConfig.secureConnection,
      // authMethod: 'CRAM-MD5',
      tls: {rejectUnauthorized: false},
      startTLS: mailConfig.startTLS,
      logger: mailConfig.logger,
      debug: mailConfig.debug, // include SMTP traffic in the logs
    },
    {
      // sender info
      from: mailConfig.from,
    }
  );

  // Message object
  let message = {
    // Comma separated list of recipients
    to: sendto,
    // Subject of the message
    subject: 'Health check report for subsystem:' + rel + sub,
    // plaintext body
    text: 'Successful!',
    contentType: 'text/html',
    attachments: [
      {
        filename: 'report.xlsx',
        path: filePath,
      },
    ],
  };

  transporter.verify(function(err, success) {
    if (err) {
      console.log(err);
      // callback(err);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log('err occurred');
      console.log(err.message);
      // callback(err);
      return process.exit(1);
    }
    console.log('Message sent successfully!');
    callback(null, true);
    // only needed when using pooled connections
    transporter.close();
  });
};
// console.log(__dirname);
exports.mail = mail;
