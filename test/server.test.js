/* global define, it, describe, before, after */

const app = require('../server/server');
const json = require('./api-request');

describe('Unexpected Usage', () => {
  before((done) => {
    require('./start-server');

    done();
  });

  after((done) => {
    app.removeAllListeners('started');
    app.removeAllListeners('loaded');
    done();
  });

  it('should not crash the server when posting a bad id', (done) => {
    json('post', '/api/v1/foobar')
      .send({})
      .expect(401, (err) => {
        if (err) return done(err);
        return done();
      });
  });
});
