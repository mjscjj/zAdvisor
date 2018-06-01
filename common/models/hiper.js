'use strict';

const getHiper = require('../../server/controller/status2/controller').getHiper;

module.exports = function (Hiper) {
  Hiper.gethiper = function (meplid, release, callback) {
    getHiper(meplid, release, function (err, data) {
      if (err) {
      callback("no such data")
      } else {
        console.log(data)
        callback(null, data.length, data);
      }
    });
  };

  Hiper.remoteMethod(
    'gethiper', {
      accepts: [{arg: 'meplid', type: 'string', require: true}, {arg: 'release', type: 'string', require: true}],
      http: {
        path: '/gethiper',
        verb: 'get',
      },
      returns: [{
        arg: 'numbers',
        type: 'number',
      }, {
        arg: 'hipers',
        type: 'array',
      }],
    }
  );
};
