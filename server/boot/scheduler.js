'use strict';

const co = require('co');
const pushService = require('../utils/pushService');
const logger = require('../utils/logHelper').helper;
/**
 * @ignore  =====================================================================================
 * @file scan new apars and add to notices every one hour
 * @author  shizy@cn.ibm.com
 * @copyright Copyright IBM Corp. 2013,2016. All Rights Reserved.
 * @ignore  created in 2016-06-23
 * @ignore  =====================================================================================
 */

module.exports = (app) => {
  const interval = 60000 * 120; // 2 hours

  // const interval = 1000;
  // let findNewHiperApars;


  function scanRecentApars(cb) {
    const Apar = app.models.Apar;
    const Notice = app.models.Notice;
    const Account = app.models.Account;
    const UserNotice = app.models.UserNotice;
    const Install = app.models.Install;

    let tx;
    let users = [];
    let apars = [];

    co(function* scanApars() {
      apars = yield Apar.find({
        order: 'closeDate ASC',
        where: {
          and: [{
            lastUpdated: null,
            rating: {
              gt: 0.0,
            },
          }, {
            or: [{
              hiper: true,
            }, {
              pe: true,
            }],
          }],
        },
        //include: 'pes'
      });

      logger.writeInfo(`find new apars number ${apars.length}`);
      if (apars.length < 1) return null;

      users = yield Account.find();

      // Transaction:
      //  1. put new Apar into Notice,
      //  2. update Apar attribute,
      //  3. add UserNotice entries for every account
      tx = yield Apar.beginTransaction({
        isolationLevel: Apar.Transaction.READ_COMMITTED,
      });

      // create notice for every apar
      for (let i = 0; i < apars.length; i += 1) {
        const apar = apars[i];
        const notice = yield Notice.create({
          // "type": (apar.pes() && apar.pes().length > 1) ? "Pe" : "Hiper",
          type: apar.pe ? 'Pe' : 'Hiper',
          title: apar.aparId,
          abstract: apar.abstract,
          rating: apar.rating,
          aparId: apar.aparId,
          created: Date.now(),
        }, {
          transaction: tx,
        });

        // update lastUpdated
        yield apar.updateAttributes({
          lastUpdated: Date.now(),
        }, {
          transaction: tx,
        });

        for (let j = 0; j < users.length; j += 1) {
          const user = users[j];

          yield UserNotice.create({
            ownerId: user.id,
            noticeId: notice.id,
          }, {
            transaction: tx,
          });
        }
      }

      return apars;
    }).then(() => {
      if (tx) {
        logger.writeInfo('commit the transaction for apar scan!');
        tx.commit();
      }

      co(function* pushNotifications() {
        const handlePushError = (err, username, badge) => {
          if (err) {
            logger.writeErr(`Push message to ${username} three times but still failed...`);
          } else {
            logger.writeInfo(
              `Push ${apars.length} new APAR(s) successfully for user ${username} total unread ${badge}`);
          }
        };

        for (let i = 0; i < users.length; i += 1) {
          const installToFind = yield Install.findOne({
            where: {
              userId: users[i].email,
            }
          });

          if (installToFind) {
            const count = yield UserNotice.unReadCount(users[i].id);
            // push message
            pushService(users[i].email, count,
              `You have ${apars.length} ${apars.length > 1 ? ' new APARs' : 'new APAR'}`, 3600, handlePushError);
          }
        }
        return true;
      }).then(() => {
        // start next round
        logger.writeInfo('schedule next round');
        cb();
      }, (err) => {
        logger.writeErr(err.message, err.stack);
        // if error for UserNotice.unReadCount, schedule next round anyway
        logger.writeInfo('schedule next round');
        cb();
      });
    }, (err) => {
      if (tx) {
        tx.rollback();
      }
      logger.writeErr(err.message, err.stack);

      // if error for transaction, schedule next round anyway
      logger.writeInfo('schedule next round');
      cb();
    });
  }

  (function schedule() {
    setTimeout(() => {
      (function findApars() {
        logger.writeInfo('Start Hiper Apar Scan!');
        scanRecentApars(() => {
          schedule();
        });
      }());
    }, interval);
  }());
};
