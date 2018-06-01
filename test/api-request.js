/* global define, it, describe, before, after */

const request = require('supertest');
const app = require('../server/server');

const json = module.exports = (verb, url) => (
  request(app)[verb](url)
  .set('Content-Type', 'application/json')
  .set('Accept', 'application/json')
  // .expect('Content-Type', /json/);
);
