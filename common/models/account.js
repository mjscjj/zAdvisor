'use strict';
/**
 * @ignore  =====================================================================================
 * @file account register and login
 * @author  shizy@cn.ibm.com
 * @copyright Copyright IBM Corp. 2013,2016. All Rights Reserved.
 * @ignore  created in 2016-07-07
 * @ignore  =====================================================================================
 */
const VError = require('verror');
// reference: https://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
const app = require('../../server/server');
// const loopback = require('loopback');
const co = require('co');
const _ = require('lodash');
const logger = require('../../server/utils/logHelper').helper;
const errorHelper = require('../../server/utils/logHelper').helper;
// const passport = require('passport');

module.exports = (Account) => {
  // disable find
  Account.disableRemoteMethodByName('create');
  Account.disableRemoteMethodByName('upsert');
  Account.disableRemoteMethodByName('updateAll');
  Account.disableRemoteMethodByName('prototype.updateAttributes');

  Account.disableRemoteMethodByName('find');
  Account.disableRemoteMethodByName('findById');
  Account.disableRemoteMethodByName('findOne');
  Account.disableRemoteMethodByName('deleteById');
  // disable count & exists
  Account.disableRemoteMethodByName('confirm');
  Account.disableRemoteMethodByName('count');
  Account.disableRemoteMethodByName('exists');

  Account.disableRemoteMethodByName('login');
  Account.disableRemoteMethodByName('logout');
  Account.disableRemoteMethodByName('create');
  Account.disableRemoteMethodByName('upsert');
  Account.disableRemoteMethodByName('deleteById');
  Account.disableRemoteMethodByName('updateAll');
  Account.disableRemoteMethodByName('updateAttributes');
  Account.disableRemoteMethodByName('createChangeStream');

  Account.disableRemoteMethodByName('replaceById');
  Account.disableRemoteMethodByName('replaceOrCreate');
  Account.disableRemoteMethodByName('upsertWithWhere');

  // instance methods
  Account.disableRemoteMethodByName('prototype.__count__accessTokens');
  Account.disableRemoteMethodByName('prototype.__create__accessTokens');
  Account.disableRemoteMethodByName('prototype.__delete__accessTokens');
  Account.disableRemoteMethodByName('prototype.__destroyById__accessTokens');
  Account.disableRemoteMethodByName('prototype.__findById__accessTokens');
  Account.disableRemoteMethodByName('prototype.__get__accessTokens');
  Account.disableRemoteMethodByName('prototype.__updateById__accessTokens');

  Account.disableRemoteMethodByName('prototype.__get__notices');
  Account.disableRemoteMethodByName('prototype.__count__notices');
  Account.disableRemoteMethodByName('prototype.__create__notices');
  Account.disableRemoteMethodByName('prototype.__delete__notices');
  Account.disableRemoteMethodByName('prototype.__destroyById__notices');
  Account.disableRemoteMethodByName('prototype.__findById__notices');
  Account.disableRemoteMethodByName('prototype.__updateById__notices');

  Account.disableRemoteMethodByName('prototype.__exists__notices');
  Account.disableRemoteMethodByName('prototype.__link__notices');
  Account.disableRemoteMethodByName('prototype.__unlink__notices');

  // disable wishes
  Account.disableRemoteMethodByName('prototype.__get__wishes');
  Account.disableRemoteMethodByName('prototype.__count__wishes');
  Account.disableRemoteMethodByName('prototype.__create__wishes');
  Account.disableRemoteMethodByName('prototype.__delete__wishes');
  Account.disableRemoteMethodByName('prototype.__destroyById__wishes');
  Account.disableRemoteMethodByName('prototype.__findById__wishes');
  Account.disableRemoteMethodByName('prototype.__updateById__wishes');

  Account.disableRemoteMethodByName('prototype.__exists__wishes');
  Account.disableRemoteMethodByName('prototype.__link__wishes');
  Account.disableRemoteMethodByName('prototype.__unlink__wishes');

  // disable tags
  Account.disableRemoteMethodByName('prototype.__get__tags');
  Account.disableRemoteMethodByName('prototype.__count__tags');
  Account.disableRemoteMethodByName('prototype.__create__tags');
  Account.disableRemoteMethodByName('prototype.__delete__tags');
  Account.disableRemoteMethodByName('prototype.__destroyById__tags');
  Account.disableRemoteMethodByName('prototype.__findById__tags');
  Account.disableRemoteMethodByName('prototype.__updateById__tags');

  Account.disableRemoteMethodByName('prototype.__exists__tags');
  Account.disableRemoteMethodByName('prototype.__link__tags');
  Account.disableRemoteMethodByName('prototype.__unlink__tags');

  Account.logoff_v1 = (deviceId, req, cb) => {
    // console.log('Hello World');
    const Install = app.models.Install;

    // got access token
    // let ctx = loopback.getCurrentContext();
    // let accessToken = ctx.get('accessToken');

    const userId = req.user.id;
    // const accessToken = req.user.accessToken;

    let tx;
    co(function* doLogOff() {
      const account = yield Account.findById(userId);
      if (!account) {
        const err1 = new Error('User not found');
        err1.statusCode = 400;
        err1.code = 'USER_NOT_FOUND';
        throw err1;
      }

      tx = yield Account.beginTransaction({
        isolationLevel: Account.Transaction.READ_COMMITTED,
      });

      yield Install.destroyAll({
        // TODO: should be accessToken.userId
        userId: account.email,
        // deviceId,
      }, {
        transaction: tx,
      });

      // yield Account.logout(accessToken.id);
      yield account.updateAttributes({
        accessToken: null,
        refreshToken: null,
        lastUpdated: null,
        ttl: 0,
      }, {
        transaction: tx,
      });

      return true;
    }).then((val) => {
      tx.commit();
    cb(null, val);
  }, (err) => {
      if (tx) {
        tx.rollback();
      }
      const error = new VError(err, 'Account Logout Error');
      logger.writeErr(JSON.stringify(error), error.stack);
      cb(errorHelper.formatError(err));
    });
  };

  Account.remoteMethod(
    'logoff_v1', {
      accepts: [{
        arg: 'deviceId',
        type: 'string',
        required: true,
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
        path: '/v1/logout/:deviceId',
        verb: 'post',
        status: 204,
      },
    }
  );

  /**
   * @description
   * find and returns the tags belong to specific user
   * @param req {Request} The req object represents the HTTP request.
   * @param cb {Function} invoked when fetching succeeds or fails.  Upon
   *                   success, callback is invoked as cb(null, tags),
   *                   Upon failure, callback is invoked as cb(err) instead.
   * @throws void
   * @returns void
   */
  Account.getTags_v1 = function getTags(req, cb) {
    const Tag = app.models.Tag;
    const userId = req.user.id;

    co(function* doGetTags() {
      // get user by userId
      const account = yield Account.findById(userId);

      if (!account) {
        const err1 = new Error('User not found');
        err1.code = 'USER_NOT_FOUND';
        throw err1;
      }

      // get all tags include user
      const tags = yield Tag.find({
        order: 'production DESC',
        include: {
          relation: 'users',
          scope: {
            where: {
              email: account.email,
            },
          },
        },
      });

      const result = _.map(tags, (tag) => {
        tag.status = !(tag.users().length > 0);
      return tag;
    });

      return result;
    }).then((val) => {
      cb(null, val);
  }, (err) => {
      const error = new VError(err, 'Get Tags by User Error');
      logger.writeErr(JSON.stringify(error), error.stack);
      cb(errorHelper.formatError(err));
    });
  };

  Account.remoteMethod(
    'getTags_v1', {
      accepts: [{
        arg: 'req',
        type: 'object',
        http: {
          source: 'req',
        },
      }],
      returns: {
        type: 'array',
        root: true,
      },
      http: {
        path: '/v1/me/tags',
        verb: 'get',
      },
    }
  );

  /**
   * @description
   * update user's tags which indicates the type of notifications user want to receive
   * - update or create tag item if user unselected, delete tag item if user selected
   * @param userTags {Array} The tags user selected or unselected.
   * @param req {Request} The req object represents the HTTP request.
   * @param cb {Function} invoked when updating succeeds or fails.  Upon
   *                   success, callback is invoked as cb(null, true),
   *                   Upon failure, callback is invoked as cb(err) instead.
   * @throws void
   * @returns void
   */
  Account.updateTags_v1 = (userTags, req, cb) => {
    const UserTag = app.models.UserTag;
    const Tag = app.models.Tag;
    const userId = req.user.id;

    let tx;
    co(function* doUpdateTags() {
      tx = yield UserTag.beginTransaction({
        isolationLevel: UserTag.Transaction.READ_COMMITTED,
      });

      // get user by userId
      const account = yield Account.findById(userId);
      if (!account) {
        const err1 = new Error('User not found');
        err1.code = 'USER_NOT_FOUND';
        throw err1;
      }

      // delete all existing user's record
      yield UserTag.destroyAll({
        ownerId: userId,
      }, {
        transaction: tx,
      });

      // get all tags
      const tags = yield Tag.find();

      const inverseTags = [];
      _.map(userTags, (o) => {
        // check input id, production and tagName
        const t = _.find(tags, {
          production: o.production,
          tagName: o.tagName,
        });

      if (!t) {
        const err = new Error('Tag not found');
        err.statusCode = 400;
        err.code = 'TAG_NOT_FOUND';
        throw err;
      }

      if (!o.status) {
        inverseTags.push({
          ownerId: account.id,
          tagId: t.id,
        });
      }
    });

      yield UserTag.create(inverseTags, {
        transaction: tx,
      });

      return true;
    }).then((val) => {
      tx.commit();
    cb(null, val);
  }, (err) => {
      if (tx) {
        tx.rollback();
      }
      const error = new VError(err, 'Upate user\'s tags Error');
      logger.writeErr(JSON.stringify(error), error.stack);
      cb(errorHelper.formatError(err));
    });
  };

  Account.remoteMethod(
    'updateTags_v1', {
      accepts: [{
        arg: 'tags',
        type: 'array',
        required: true,
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
        path: '/v1/me/tags',
        verb: 'post',
        status: 204,
      },
    }
  );


  Account.is_verification_v2=(customerId,req,cb)=>{
    Account.findOne({
      where: {
        email: customerId,
      },
    },function (err,account) {
      if(err){
        cb(err)
        return
      }
      let re={};
      re.customerId=customerId
      console.log("search account,result:"+JSON.stringify(account))
      if (!account) {
        const err1 = new Error('User not found');
        err1.code = 'USER_NOT_FOUND';
        cb(err1);
        return;
      }else if(account.isVerify=='1') {
        re.verify="yes"
      }else if(account.isVerify=='0'){
        re.verify='no'
      }
      cb(null,re);
    });
  }

  Account.remoteMethod(
    'is_verification_v2', {
      accepts: [{
        arg: 'customerId',
        type: 'string',
        required: true,
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
        path: '/v2/is_verification',
        verb: 'get',
      },
    }
  );

  Account.authorize_v2=(customerId,req,cb)=>{
    Account.findOne({
      where: {
        email: customerId,
      },
    },function (err,account) {
      if(err){
        cb(err)
        return
      }else if(account==null){cb('customer no found');return}else {
        account.isVerify = "1";
        Account.upsert(account, function (err, resu) {
          if (err) {
            console.log(err);
            cb(err);
            return
          } else {
            console.log(resu)
            cb(null, "success");
          }
        })
      }
    });
  }

  Account.remoteMethod(
    'authorize_v2', {
      accepts: [{
        arg: 'customerId',
        type: 'string',
        required: true,
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
        path: '/v2/authorize',
        verb: 'post',
      },
    }
  );
  Account.cancelAuthorize_v2=(customerId,req,cb)=>{
    Account.findOne({
      where: {
        email: customerId,
      },
    },function (err,account) {
      if(err){
        console.log(err)
        cb(err)
        return
      }else if(account!=null) {
        account.isVerify = "0";
        Account.upsert(account, function (err, resu) {
          if (err) {
            console.log(err);
            cb(err);
            return
          } else {
            cb(null, "success");
          }
        })
      }else {
        cb("customer no found")
      }
    });
  }

  Account.remoteMethod(
    'cancelAuthorize_v2', {
      accepts: [{
        arg: 'customerId',
        type: 'string',
        required: true,
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
        path: '/v2/cancelauthorize',
        verb: 'post',
      },
    }
  );


};


