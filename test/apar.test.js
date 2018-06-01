/* global define, it, describe, before, after */

'use strict';
const app = require('../server/server');
const json = require('./api-request');
const assert = require('assert');
const co = require('co');
const searchIndex = require('search-index');

let testApar1;
let testApar2;
let testDocId1;
let testDocId2;

describe('Apar Rest API request', () => {
  const Apar = app.models.Apar;
  const Account = app.models.Account;
  const Pe = app.models.Pe;
  const Ptf = app.models.Ptf;

  before((done) => {
    // should start searchIndex service
    searchIndex({}, (err1, si) => {
      if (err1) throw (err1);

      app.si = si;
      app.start();
    });

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

      // create apar and ptf PI88888 / UI88888
      testApar1 = yield Apar.create({
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

      // yield testApar1.ptfs.destroyAll();
      yield testApar1.ptfs.create({
        ptfId: 'UI88888',
        release: 'A',
        subRelease: 1,
      });

      // create apar and ptf PI99999/UI99999
      testApar2 = yield Apar.create({
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

      // yield testApar2.ptfs.destroyAll();
      // yield testApar2.pes.destroyAll();

      yield testApar2.ptfs.create({
        ptfId: 'UI99999',
        release: 'A',
        subRelease: 1,
      });

      yield Pe.create({
        aparId: testApar2.aparId,
        ptfId: 'UI88888',
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
      yield Ptf.destroyAll({
        where: {
          ptfId: 'UI88888',
        },
      });
      yield apar1.destroy();


      // destroy apar 2
      const apar2 = yield Apar.findOne({
        where: {
          aparId: 'PI99999',
        },
      });
      yield Ptf.destroyAll({
        where: {
          ptfId: 'UI99999',
        },
      });
      yield Pe.destroyAll({
        where: {
          ptfId: 'UI88888',
        },
      });
      yield apar2.pes.destroyAll();
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
    json('get', '/api/apars/v1/me/PI88888')
      .expect(401, (err) => {
        if (err) throw err;
        done();
      });
  });

  it('should not allow search without access token', (done) => {
    json('get', '/api/apars/v1/search?keywords=hello')
      .expect(401, (err) => {
        if (err) throw err;
        done();
      });
  });

  it('should return 400 when aparId invalid', (done) => {
    json('get', '/api/apars/v1/me/11111PI?access_token=test_access')
      .expect(400, (err, res) => {
        if (err) throw err;
        assert.equal(res.body.error.status, 400);
        assert.equal(res.body.error.message, 'Invalid aparId or userId');
        done();
      });
  });

  it('should return 400 when search for apar PI11111', (done) => {
    json('get', '/api/apars/v1/me/PI11111?access_token=test_access')
      .expect(400, (err, res) => {
        if (err) throw err;
        assert.equal(res.body.error.status, 400);
        assert.equal(res.body.error.message, 'Apar not found');
        done();
      });
  });

  /* test /apars/me */
  it('should get apar PI88888', (done) => {
    json('get', '/api/apars/v1/me/PI88888?access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.hiper, true);
        assert.equal(res.body.dataLoss, false);
        assert.equal(res.body.aparId, 'PI88888');
        assert.notEqual(res.body.ptfs, null);
        assert.notEqual(res.body.ptfs, undefined);
        assert.equal(res.body.ptfs.length, 1);
        assert.equal(res.body.ptfs[0].ptfId, 'UI88888');
        assert.equal(res.body.pes.length, 0);
        return done();
      });
  });

  /* test /apars/me */
  it('should get apar PI99999', (done) => {
    json('get', '/api/apars/v1/me/PI99999?access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.hiper, false);
        assert.equal(res.body.dataLoss, true);
        assert.equal(res.body.aparId, 'PI99999');
        assert.notEqual(res.body.ptfs, null);
        assert.notEqual(res.body.ptfs, undefined);
        assert.equal(res.body.ptfs.length, 1);
        assert.equal(res.body.ptfs[0].ptfId, 'UI99999');
        assert.notEqual(res.body.pes, null);
        assert.notEqual(res.body.pes, undefined);
        assert.equal(res.body.pes.length, 1);
        assert.equal(res.body.pes[0].ptfId, 'UI88888');
        return done();
      });
  });

  /* test /apars/search */
  it('should add search index of PI88888', (done) => {
    json('post', '/api/search/v1/add?access_token=test_access')
      .send({
        aparId: testApar1.aparId,
        abstract: testApar1.abstract,
        description: testApar1.description,
        triggers: testApar1.triggers,
        summary: testApar1.summary,
        conclusion: testApar1.conclusion,
      }).expect(201, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should get search result of PI88888 (aparId as keyword)', (done) => {
    json('get', '/api/apars/v1/search?keywords=PI88888&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.notEqual(res.body, null);
        assert.notEqual(res.body, undefined);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].aparId, 'PI88888');
        testDocId1 = res.body[0].id; // only need to be assigned once
        return done();
      });
  });

  it('should get search result of PI88888 (summary as keyword)', (done) => {
    json('get', '/api/apars/v1/search?keywords=PI88888%20summary&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.notEqual(res.body, null);
        assert.notEqual(res.body, undefined);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].aparId, 'PI88888');
        return done();
      });
  });

  it('should get search result of PI88888 (triggers as keyword)', (done) => {
    json('get', '/api/apars/v1/search?keywords=PI88888%20condition&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.notEqual(res.body, null);
        assert.notEqual(res.body, undefined);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].aparId, 'PI88888');
        return done();
      });
  });

  it('should get search result of PI88888 (localfix as keyword)', (done) => {
    json('get', '/api/apars/v1/search?keywords=PI88888%20localfix&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.notEqual(res.body, null);
        assert.notEqual(res.body, undefined);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].aparId, 'PI88888');
        return done();
      });
  });

  it('should not get search result of PI9999 (aparId as keyword)', (done) => {
    json('get', '/api/apars/v1/search?keywords=PI9999&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.notEqual(res.body, null);
        assert.notEqual(res.body, undefined);
        assert.equal(res.body.length, 0);
        return done();
      });
  });

  it('should add search index of PI99999', (done) => {
    json('post', '/api/search/v1/add?access_token=test_access')
      .send({
        aparId: testApar2.aparId,
        abstract: testApar2.abstract,
        description: testApar2.description,
        triggers: testApar2.triggers,
        summary: testApar2.summary,
        conclusion: testApar2.conclusion,
      }).expect(201, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should get search result of PI99999 (aparId as keyword)', (done) => {
    json('get', '/api/apars/v1/search?keywords=PI99999&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.notEqual(res.body, null);
        assert.notEqual(res.body, undefined);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].aparId, 'PI99999');
        testDocId2 = res.body[0].id; // only need to be assigned once
        return done();
      });
  });

  it('should get 2 items using default limit and offset', (done) => {
    json('get', '/api/apars/v1/search?keywords=common_field&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert(res.body !== null &&
          res.body !== undefined);
        assert.equal(res.body.length, 2);
        assert.equal(res.body[0].aparId, 'PI88888');
        assert.equal(res.body[1].aparId, 'PI99999');
        return done();
      });
  });

  it('should get only PI88888 when limit = 1', (done) => {
    json('get', '/api/apars/v1/search?keywords=common_field&limit=1&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert(res.body !== null &&
          res.body !== undefined);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].aparId, 'PI88888');
        return done();
      });
  });

  it('should get only PI99999 when skip = 1', (done) => {
    json('get', '/api/apars/v1/search?keywords=common_field&skip=1&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert(res.body !== null &&
          res.body !== undefined);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].aparId, 'PI99999');
        return done();
      });
  });

  it('should remove search index of PI88888', (done) => {
    json('delete', `/api/search/v1/${testDocId1}?access_token=test_access`)
      .expect(204, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should remove search index of PI99999', (done) => {
    json('delete', `/api/search/v1/${testDocId2}?access_token=test_access`)
      .expect(204, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should not get search result of PI88888 (aparId as keyword)', (done) => {
    json('get', '/api/apars/v1/search?keywords=PI88888&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) throw err;
        assert(typeof res.body === 'object');
        assert(res.body !== null &&
          res.body !== undefined &&
          res.body.length === 0);
        done();
      });
  });

  it('should not get search result of PI99999 (aparId as keyword)', (done) => {
    json('get', '/api/apars/v1/search?keywords=PI99999&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) throw err;
        assert(typeof res.body === 'object');
        assert(res.body !== null &&
          res.body !== undefined &&
          res.body.length === 0);
        done();
      });
  });
});
