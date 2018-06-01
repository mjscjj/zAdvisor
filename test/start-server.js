/* global define, it, describe, before, after */

// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

const app = require('../server/server');

module.exports = (done) => {
  if (app.loaded) {
    app.once('started', done);
    app.start();
  } else {
    app.once('loaded', () => {
      app.once('started', done);
      app.start();
    });
  }
};
