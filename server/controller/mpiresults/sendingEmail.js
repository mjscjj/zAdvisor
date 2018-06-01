'use strict';

let _ = require('lodash');
let pluck = require('lodash.pluck');
let searchR = require('./searchReleaseSub');
let mail = require('./mailer2');

let sendingEmail = function(meplId, sendto, callback) {
  try {
    searchR.getReleaseSub(meplId, function(err, meplRelease) {
      if (meplRelease !== undefined && meplRelease !== null) {
        let mepl = meplRelease[0].MEPLID;
        let rel = meplRelease[0].RELEASE;
        let sub = meplRelease[0].SUBRELEASE;
        let title = mepl + rel + sub + '.xlsx';
        let fpath = __dirname + '\\reports\\' + title;
        mail.mail(sendto, fpath, rel, sub, function(err, result) {
          callback(null, result);
        });
      }
    });
  } catch (err) {
    console.log(err);
    callback(err, false);
  }
};
// sendingEmail('5825', 'luoxinyu@cn.ibm.com');
exports.sendingEmail = sendingEmail;
