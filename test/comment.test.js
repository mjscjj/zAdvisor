/* global define, it, describe, before, after */

'use strict';

const app = require('../server/server');
const json = require('./api-request');
const assert = require('assert');
const co = require('co');

describe('Comment Rest API request', () => {
  const Account = app.models.Account;
  const Comment = app.models.Comment;

  before((done) => {
    co(function* doBefore() {
      // create account for test
      yield Account.create({
        email: 'test@cn.ibm.com',
        accessToken: 'test_access',
        refreshToken: 'test_refresh',
        ttl: 3600,
        lastUpdated: Date.now(),
        role: 'ROLE_USER',
      });
    }).then(() => (
      done()
    ), (err) => {
      if (err) return done(err);
      return done();
    });
  });

  after((done) => {
    co(function* doBefore() {
      yield Comment.destroyAll({
        from: 'abc@cn.ibm.com',
      });

      yield Account.destroyAll({
        email: 'test@cn.ibm.com',
      });
    }).then(() => (
      done()
    ), (err) => {
      if (err) return done(err);
      return done();
    });
  });

  it('should return 401 if not login', (done) => {
    json('post', '/api/comments/v1/send')
      .send({
        from: 'abc@cn.ibm.com',
        text: 'abc',
      }).expect(401, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should return comment after post success', (done) => {
    json('post', '/api/comments/v1/send?access_token=test_access')
      .send({
        from: 'abc@cn.ibm.com',
        text: 'abc',
      }).expect(201, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.text, 'abc');
        return done();
      });
  });

  it('should return validation error if text is null', (done) => {
    json('post', '/api/comments/v1/send?access_token=test_access')
      .send({
        from: 'abc@cn.ibm.com',
        text: null,
      }).expect(422, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.error.message, 'property: \'text\', reason: can\'t be blank');
        return done();
      });
  });

  it('should return validation error if text is empty', (done) => {
    json('post', '/api/comments/v1/send?access_token=test_access')
      .send({
        from: 'abc@cn.ibm.com',
        text: '',
      }).expect(422, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.error.message, 'property: \'text\', reason: can\'t be blank');
        return done();
      });
  });

  it('should return validation error if email is null', (done) => {
    json('post', '/api/comments/v1/send?access_token=test_access')
      .send({
        from: null,
        text: 'comment content here',
      }).expect(422, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.error.message, 'property: \'from\', reason: can\'t be blank');
        return done();
      });
  });

  it('should return validation error if email is empty', (done) => {
    json('post', '/api/comments/v1/send?access_token=test_access')
      .send({
        from: '',
        text: 'comment content here',
      }).expect(422, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.error.message, 'property: \'from\', reason: can\'t be blank');
        return done();
      });
  });

  it('should return validation error if both email and text are null', (done) => {
    json('post', '/api/comments/v1/send?access_token=test_access')
      .send({
        from: null,
        text: null,
      }).expect(422, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.error.message, 'property: \'text\', reason: can\'t be blank');
        return done();
      });
  });

  it('should return validation error if both email and text are empty', (done) => {
    json('post', '/api/comments/v1/send?access_token=test_access')
      .send({
        from: '',
        text: '',
      }).expect(422, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.error.message, 'property: \'text\', reason: can\'t be blank');
        return done();
      });
  });
});
