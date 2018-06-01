'use strict';

/**
 * @ignore  =====================================================================================
 * @file add or update device
 * @author  fjb@cn.ibm.com
 * @copyright Copyright IBM Corp. 2013,2016. All Rights Reserved.
 * @ignore  created in 2016-07-21
 * @ignore  =====================================================================================
 */

const co = require('co');
const VError = require('verror');
const logger = require('../../server/utils/logHelper').helper;
const errorHelper = require('../../server/utils/logHelper').helper;

module.exports = (Install) => {
  // disable find
  Install.disableRemoteMethodByName('find');
  Install.disableRemoteMethodByName('findById');
  Install.disableRemoteMethodByName('findOne');
  Install.disableRemoteMethodByName('findByApp');
  Install.disableRemoteMethodByName('findByUser');
  Install.disableRemoteMethodByName('findBySubscriptions');

  // disable count & exists
  Install.disableRemoteMethodByName('confirm');
  Install.disableRemoteMethodByName('count');
  Install.disableRemoteMethodByName('exists');

  Install.disableRemoteMethodByName('login');
  Install.disableRemoteMethodByName('create');
  Install.disableRemoteMethodByName('upsert');
  Install.disableRemoteMethodByName('deleteById');
  Install.disableRemoteMethodByName('updateAll');
  Install.disableRemoteMethodByName('updateAttributes');
  Install.disableRemoteMethodByName('createChangeStream');

  Install.disableRemoteMethodByName('replaceById');
  Install.disableRemoteMethodByName('replaceOrCreate');
  Install.disableRemoteMethodByName('upsertWithWhere');

  Install.addOrUpdate_v1 = (install, req, cb) => {
    let tx;
    logger.writeInfo(`${install.deviceId} ${install.userId}`);

    co(function* doAddOrUpdate() {
      tx = yield Install.beginTransaction({
        isolationLevel: Install.Transaction.READ_COMMITTED,
      });

      const installToFind = yield Install.findOne({
        where: {
          // deviceId: install.deviceId,
          userId: install.userId,
        },
      });

      let installCreated;
      if (!installToFind) {
        logger.writeInfo('creating new Install ');
        installCreated = yield Install.create(install, {
          transaction: tx,
        });
      } else {
        logger.writeInfo('updating existed Install');
        installCreated = yield installToFind.updateAttributes(install);
      }

      return installCreated;
    }).then((val) => {
      tx.commit();
      cb(null, val);
    }, (err) => {
      if (tx) {
        tx.rollback();
      }
      const error = new VError(err, 'Add or Update Device Error');
      logger.writeErr(JSON.stringify(error), error.stack);

      cb(errorHelper.formatError(err));
    });
  };

  Install.remoteMethod(
    'addOrUpdate_v1', {
      accepts: [{
        arg: 'install',
        type: 'Install',
        http: {
          source: 'body',
        },
      }, {
        arg: 'req',
        type: 'object',
        http: {
          source: 'req',
        },
      }],
      returns: {
        type: 'object',
        root: true,
      },
      http: {
        path: '/v1/addOrUpdate',
        verb: 'post',
        status: 200,
      },
    }
  );
};
