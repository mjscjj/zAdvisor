'use strict';

//const app = require('../server/server');
const pushService = require('./../server/utils/pushService');

describe('Push Test', () => {
  it('should push messge to htengbj', (done) => {
    // push message
    pushService('htengbj@cn.ibm.com', 1, 'You have 1 new APAR', 3600, null);
    done();
  });
});
