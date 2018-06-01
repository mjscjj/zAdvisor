/* global define, it, describe, before, after */

'use strict';
const app = require('../server/server');
const json = require('./api-request');
const assert = require('assert');
const co = require('co');


describe('Wish Rest API request', () => {
  const Apar = app.models.Apar;
  const Account = app.models.Account;
  const Notice = app.models.Notice;
  const Tag = app.models.Tag;
  const UserTag = app.models.UserTag;
  const AparTag = app.models.AparTag;
  const UserNotice = app.models.UserNotice;
  // const Wish = app.models.Wish;

  before((done) => {
    co(function* doBefore() {
      // create account for test
      const user = yield Account.create({
        email: 'test@cn.ibm.com',
        accessToken: 'test_access',
        refreshToken: 'test_refresh',
        ttl: 3600,
        lastUpdated: Date.now(),
        role: 'ROLE_ADMIN', // use admin to create search index
      });

      // another account
      const user1 = yield Account.create({
        email: 'test1@cn.ibm.com',
        accessToken: 'test1_access',
        refreshToken: 'test1_refresh',
        ttl: 3600,
        lastUpdated: Date.now(),
        role: 'ROLE_REGULAR',
      });

      // create tag DB2_TEST_TAG & CICS_TEST_TAG
      const tag1 = yield Tag.create({
        production: 'DB2',
        tagName: 'DB2_TEST_TAG',
      });

      const tag2 = yield Tag.create({
        production: 'DB2',
        tagName: 'DB2_TEST_TAG_2',
      });

      const tag3 = yield Tag.create({
        production: 'CICS',
        tagName: 'CICS_TEST_TAG',
      });

      // create apar PI77777
      yield Apar.create({
        aparId: 'PI77777',
        hiper: true,
        closeDate: Date.now(),
        production: 'DB2',
        dataLoss: false,
        funcLoss: false,
        outage: false,
        perf: false,
        summary: 'PI77777 summary common_field',
        triggers: 'PI77777 condition',
        localfix: 'PI77777 localfix',
        created: Date.now(),
      });

      yield Apar.create({
        aparId: 'PI88888',
        hiper: true,
        closeDate: Date.now(),
        production: 'DB2',
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
        hiper: false,
        closeDate: Date.now(),
        production: 'CICS',
        dataLoss: true,
        funcLoss: false,
        outage: false,
        perf: false,
        summary: 'PI99999 summary common_field',
        triggers: 'PI99999 condition',
        localfix: 'PI99999 localfix',
        created: Date.now(),
      });

      // create aparTags
      yield AparTag.create([{
        aparId: 'PI77777',
        tagId: tag1.id,
      }, {
        aparId: 'PI88888',
        tagId: tag2.id,
      }, {
        aparId: 'PI99999',
        tagId: tag3.id,
      }]);

      // add apar to UserNotices
      yield user.notices.create({
        type: 'Hiper',
        title: 'PI77777',
        abstract: 'PI77777 summary',
        description: 'PI77777 condition',
        rating: 0.2,
        aparId: 'PI77777',
        created: Date.now(),
      });
      yield user.notices.create({
        type: 'Hiper',
        title: 'PI88888',
        abstract: 'PI88888 summary',
        description: 'PI88888 condition',
        rating: 0.5,
        aparId: 'PI88888',
        created: Date.now(),
      });
      yield user.notices.create({
        type: 'Red Alert',
        title: 'PI99999',
        abstract: 'PI99999 summary',
        description: 'PI99999 condition',
        rating: 1.0,
        aparId: 'PI99999',
        created: Date.now(),
      });

      const notice = yield Notice.findOne({
        where: {
          title: 'PI77777',
        },
      });

      yield UserNotice.create({
        ownerId: user1.id,
        noticeId: notice.id,
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
      // destroy aparTags
      yield AparTag.destroyAll({
        aparId: {
          inq: ['PI77777', 'PI88888', 'PI99999'],
        },
      });

      // destroy tags
      yield Tag.destroyAll({
        tagName: {
          inq: ['DB2_TEST_TAG', 'DB2_TEST_TAG_2', 'CICS_TEST_TAG'],
        },
      });

      // destroy apars
      yield Apar.destroyAll({
        aparId: {
          inq: ['PI77777', 'PI88888', 'PI99999'],
        },
      });

      // remove apar from UserNotices
      const user = yield Account.findOne({
        where: {
          email: 'test@cn.ibm.com',
        },
      });
      yield user.wishes.destroyAll();
      yield user.notices.destroyAll();
      yield user.tags.destroyAll();
      yield user.destroy();

      const user1 = yield Account.findOne({
        where: {
          email: 'test1@cn.ibm.com',
        },
      });
      yield user1.wishes.destroyAll();
      yield user1.notices.destroyAll();
      yield user1.destroy();

      yield Notice.destroyAll({
        title: {
          inq: ['PI77777', 'PI88888', 'PI99999'],
        },
      });
    }).then(() => (
      done()
    ), (err) => {
      if (err) throw err;
    });
  });

  it('should not allow access without access token', (done) => {
    json('get', '/api/notices/v1/me/DB2')
      .expect(401, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should not allow to get unread count without access token', (done) => {
    json('get', '/api/notices/v1/me/unread')
      .expect(401, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should return 400 when production invalid', (done) => {
    json('get', '/api/notices/v1/me/D2B?skip=1&access_token=test_access')
      .expect(400, (err) => {
        if (err) return done(err);
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

  it("should get first & second notices 'favorite' 0", (done) => {
    json('get', '/api/notices/v1/me/DB2?access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert.equal(res.body.length, 2);
        assert.equal(res.body[0].title, 'PI88888');
        assert.equal(res.body[1].title, 'PI77777');
        assert.equal(res.body[0].favorite, 0);
        assert.equal(res.body[1].favorite, 0);
        return done();
      });
  });

  it("should get third notice 'favorite' 1", (done) => {
    json('get', '/api/notices/v1/me/CICS?access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].title, 'PI99999');
        assert.equal(res.body[0].favorite, 1);
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

  it('should get only PI88888 when limit = 1', (done) => {
    json('get', '/api/notices/v1/me/DB2?limit=1&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.notEqual(res.body, null);
        assert.notEqual(res.body, undefined);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].title, 'PI88888');
        return done();
      });
  });

  it('should get only PI77777 when skip = 1', (done) => {
    json('get', '/api/notices/v1/me/DB2?skip=1&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.notEqual(res.body, null);
        assert.notEqual(res.body, undefined);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].title, 'PI77777');
        return done();
      });
  });

  it('should get 3 unread notices', (done) => {
    json('get', '/api/notices/v1/me/unread?access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert.equal(res.body.count, 3);
        return done();
      });
  });

  it('should get apar PI88888', (done) => {
    json('get', '/api/apars/v1/me/PI88888?access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.hiper, true);
        assert.equal(res.body.dataLoss, false);
        assert.equal(res.body.aparId, 'PI88888');
        assert.equal(res.body.favorite, false);
        return done();
      });
  });

  it('should get 2 unread notices', (done) => {
    json('get', '/api/notices/v1/me/unread?access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert.equal(res.body.count, 2);
        return done();
      });
  });

  // user tag test
  it('should return 2 notices about DB2', (done) => {
    json('get', '/api/notices/v1/me/DB2?&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.length, 2);
        return done();
      });
  });

  // change tags
  it('should return 204 when save user tags to CICS', (done) => {
    json('post', '/api/accounts/v1/me/tags?&access_token=test_access')
      .send({
        tags: [{
          production: 'DB2',
          tagName: 'DB2_TEST_TAG',
          status: false,
        }, {
          production: 'DB2',
          tagName: 'DB2_TEST_TAG_2',
          status: false,
        }, {
          production: 'CICS',
          tagName: 'CICS_TEST_TAG',
          status: true,
        }],
      }).expect(204, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should return 1 notices about CICS', (done) => {
    json('get', '/api/notices/v1/me/CICS?&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.length, 1);
        return done();
      });
  });

  it('should return 0 notices about DB2', (done) => {
    json('get', '/api/notices/v1/me/DB2?&access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.length, 0);
        return done();
      });
  });


  // favorite issue reported by meizhen
  it('should return 201 when add PI88888 to wish list', (done) => {
    json('post', '/api/wishes/v1/me/PI88888?access_token=test_access')
      .expect(201, (err, res) => {
        if (err) return done(err);
        assert.equal(res.body.aparId, 'PI88888');
        return done();
      });
  });

  it("should get notice 'favorite' 0 for account test1@cn.ibm.com", (done) => {
    json('get', '/api/notices/v1/me/DB2?access_token=test1_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].title, 'PI77777');
        assert.equal(res.body[0].favorite, 0);
        return done();
      });
  });
});
