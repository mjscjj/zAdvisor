/* global define, it, describe, before, after */

'use strict';
const app = require('../server/server');
const json = require('./api-request');
const assert = require('assert');
const co = require('co');

describe('Wish Rest API request', () => {
  const Apar = app.models.Apar;
  const Account = app.models.Account;
  // const Wish = app.models.Wish;

  before((done) => {
    co(function* doBefore() {
      // create account for test
      yield Account.create({
        email: 'test@cn.ibm.com',
        accessToken: 'test_access',
        refreshToken: 'test_refresh',
        ttl: 3600,
        lastUpdated: Date.now(),
        role: 'ROLE_ADMIN', // use admin to create search index
      });

      // create apar PI88888
      yield Apar.create({
        aparId: 'PI88888',
        production: 'DB2',
        hiper: true,
        closeDate: Date.now(),
        dataLoss: false,
        funcLoss: false,
        outage: false,
        perf: false,
        summary: 'PI88888 summary common_field',
        triggers: 'PI88888 condition',
        localfix: 'PI88888 localfix',
        created: Date.now(),
      });

      // create apar PI99999
      yield Apar.create({
        aparId: 'PI99999',
        production: 'DB2',
        hiper: false,
        closeDate: Date.now(),
        dataLoss: true,
        funcLoss: false,
        outage: false,
        perf: false,
        summary: 'PI99999 summary common_field',
        triggers: 'PI99999 condition',
        localfix: 'PI99999 localfix',
        created: Date.now(),
      });

      return true;
    }).then(() => (
      done()
    ), (err) => {
      if (err) throw err;
    });
  });

  after((done) => {
    co(function* doAfter() {
      // destroy apar 1
      const apar1 = yield Apar.findOne({
        where: {
          aparId: 'PI88888',
        },
      });
      // yield apar1.ptfs.destroyAll();
      yield apar1.destroy();

      const apar2 = yield Apar.findOne({
        where: {
          aparId: 'PI99999',
        },
      });
      // yield apar1.ptfs.destroyAll();
      yield apar2.destroy();

      // destroy test account
      yield Account.destroyAll({
        email: 'test@cn.ibm.com',
      });
    }).then(() => (
      done()
    ), (err) => {
      if (err) throw err;
    });
  });

  /* test authentication */
  it('should not allow access without access token', (done) => {
    json('get', '/api/wishes/v1/me')
      .expect(401, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should not allow to add wish without access token', (done) => {
    json('post', '/api/wishes/v1/me/PI88888')
      .expect(401, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should not allow to remove wish without access token', (done) => {
    json('delete', '/api/wishes/v1/me/PI88888')
      .expect(401, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  /* test /wishes/me */
  it('should not be favorite for PI88888', (done) => {
    json('get', '/api/wishes/v1/me?access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert.notEqual(res.body, null);
        assert.notEqual(res.body, undefined);
        assert(res.body.length === 0);
        return done();
      });
  });

  it('should return 201 when add PI88888 to wish list', (done) => {
    json('post', '/api/wishes/v1/me/PI88888?access_token=test_access')
      .expect(201, (err, res) => {
        if (err) return done(err);
        assert.equal(res.body.aparId, 'PI88888');
        return done();
      });
  });

  it('should not add same apar to wish list', (done) => {
    json('post', '/api/wishes/v1/me/PI88888?access_token=test_access')
      .expect(201, (err, res) => {
        if (err) return done(err);
        assert.equal(res.body.aparId, 'PI88888');
        return done();
      });
  });

  it('should return 201 when add PI99999 to wish list', (done) => {
    json('post', '/api/wishes/v1/me/PI99999?access_token=test_access')
      .expect(201, (err, res) => {
        if (err) return done(err);
        assert.equal(res.body.aparId, 'PI99999');
        return done();
      });
  });

  it('should be favorite for PI88888 & PI99999', (done) => {
    json('get', '/api/wishes/v1/me?access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert.notEqual(res.body, null);
        assert.notEqual(res.body, undefined);
        assert.equal(res.body.length, 2);
        assert.equal(res.body[0].aparId, 'PI99999');
        assert.equal(res.body[1].aparId, 'PI88888');
        return done();
      });
  });

  it('should return PI99999 when limit = 1', (done) => {
    json('get', '/api/wishes/v1/me?limit=1&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert.notEqual(res.body, null);
        assert.notEqual(res.body, undefined);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].aparId, 'PI99999');
        return done();
      });
  });

  it('should return PI88888 when skip = 1', (done) => {
    json('get', '/api/wishes/v1/me?skip=1&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert.notEqual(res.body, null);
        assert.notEqual(res.body, undefined);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].aparId, 'PI88888');
        return done();
      });
  });

  it('should return 400 when remove PI66666 to wish list', (done) => {
    json('delete', '/api/wishes/v1/me/PI66666?access_token=test_access')
      .expect(400, (err, res) => {
        if (err) return done(err);
        assert.equal(res.body.error.message, 'Wish not found');
        return done();
      });
  });

  it('should return 204 when remove PI88888 from wish list', (done) => {
    json('delete', '/api/wishes/v1/me/PI88888?access_token=test_access')
      .expect(204, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should return 204 when remove PI99999 from wish list', (done) => {
    json('delete', '/api/wishes/v1/me/PI99999?access_token=test_access')
      .expect(204, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should not be favorite for PI88888 & PI99999 after deleting', (done) => {
    json('get', '/api/wishes/v1/me?access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert.notEqual(res.body, null);
        assert.notEqual(res.body, undefined);
        assert(res.body.length === 0);
        return done();
      });
  });
});
