'use strict';

const app = require('../server');
const co = require('co');
const events = require('events');
const logger = require('../utils/logHelper').helper;

// read csect history and apars
const db2 = {};
const csects = db2.csects = {};
const apars = db2.apars = new Map();
const ptfs = db2.ptfs = new Map();
module.exports = db2;

const proxy = new events.EventEmitter();

let status = 'empty';
let start;
let diff;
let ms;
proxy.on('error', (err) => {
  throw err;
});
db2.read = (cb) => {
  const Relation = app.models.Relation;
  const Apar = app.models.Apar;

  proxy.once('read', cb);

  // console.log('db2 status: ', status);
  switch (status) {
    case 'empty':
      co(function* handleEmpty() {
        status = 'pending';

        // load history
        start = process.hrtime();
        const rels = yield Relation.find({
          where: {
            // and: [{release: 'A'}, {subRelease: 1}, {type: 2}]
            type: 2,
          },
          order: ['csect ASC', 'release ASC', 'subRelease ASC', 'rank ASC'],
        });

        let prevCsect = null;
        let prevRank = null;
        let preVersion = null;

        for (let i = 0; i < rels.length; i += 1) {
          const version = `${rels[i].release}.${rels[i].subRelease}`;
          if (!csects[version]) {
            csects[version] = new Map();
          }

          // ptfs version
          if (!ptfs.has(rels[i].ptfId)) {
            const item = {};
            item.version = version;
            item.csects = [rels[i].csect];
            ptfs.set(rels[i].ptfId, item);
          } else {
            const item = ptfs.get(rels[i].ptfId);
            item.csects.push(rels[i].csect);
          }

          // new csect
          if (prevCsect === null || rels[i].csect !== prevCsect || version !== preVersion) {
            prevCsect = rels[i].csect;
            prevRank = 0;
            preVersion = version;

            const items = [];
            csects[version].set(rels[i].csect, items);

            if (rels[i].rank !== prevRank + 1) {
              // console.log(rels[i].csect, rels[i].rank, prevRank);
              throw new Error('CSECT Rank Wrong!');
            } else {
              items.push({
                aparId: rels[i].aparId,
                ptfId: rels[i].ptfId,
                rank: rels[i].rank,
              });
              prevRank += 1;
            }
          } else if (rels[i].rank !== prevRank + 1) {
            // console.log(rels[i].csect, rels[i].rank, prevRank);
            throw new Error('CSECT Rank Wrong!');
          } else {
            // rest apars for every csect
            const items = csects[version].get(rels[i].csect);
            items.push({
              aparId: rels[i].aparId,
              ptfId: rels[i].ptfId,
              rank: rels[i].rank,
            });
            prevRank += 1;
          }
        }

        diff = process.hrtime(start);
        ms = (diff[0] * 1e3) + (diff[1] * 1e-6);
        logger.writeInfo('Csect History Init Success --', ms, ' ms');

        // load apars
        start = process.hrtime();
        const allApars = yield Apar.find({
          include: ['ptfs', 'pes'],
        });

        for (let i = 0; i < allApars.length; i += 1) {
          // console.log(apars[i].aparId, apars[i]);
          apars.set(allApars[i].aparId, allApars[i]);
        }

        diff = process.hrtime(start);
        ms = (diff[0] * 1e3) + (diff[1] * 1e-6);
        logger.writeInfo('Apar History Init Success --', ms, ' ms');
      }).then(() => {
        proxy.emit('read');
        status = 'ready';
      }, (err) => {
        logger.writeErr(err.message, err.stack);
        throw err;
      });

      break;
    case 'ready':
      cb();
      break;
    default:
      break;
  }
};
