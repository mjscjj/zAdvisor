'use strict';

/**
 * @ignore  =====================================================================================
 * @file get notices
 * @author  shizy@cn.ibm.com
 * @copyright Copyright IBM Corp. 2013,2016. All Rights Reserved.
 * @ignore  created in 2016-07-07
 * @ignore  =====================================================================================
 */

// const loopback = require('loopback');
const app = require('../../server/server');
// const assert = require('assert');
const co = require('co');
const _ = require('lodash');
const VError = require('verror');
const logger = require('../../server/utils/logHelper').helper;
const errorHelper = require('../../server/utils/logHelper').helper;

module.exports = (Notice) => {
  Notice.disableRemoteMethodByName('find');
  Notice.disableRemoteMethodByName('findById');
  Notice.disableRemoteMethodByName('findOne');

  // disable count & exists
  Notice.disableRemoteMethodByName('confirm');
  Notice.disableRemoteMethodByName('count');
  Notice.disableRemoteMethodByName('exists');

  Notice.disableRemoteMethodByName('create');
  Notice.disableRemoteMethodByName('upsert');
  Notice.disableRemoteMethodByName('deleteById');
  Notice.disableRemoteMethodByName('updateAll');
  Notice.disableRemoteMethodByName('updateAttributes');
  Notice.disableRemoteMethodByName('createChangeStream');

  Notice.disableRemoteMethodByName('replaceById');
  Notice.disableRemoteMethodByName('replaceOrCreate');
  Notice.disableRemoteMethodByName('upsertWithWhere');

  Notice.disableRemoteMethodByName('__get__apar');

  /**
   * @description
   * find and returns UserNotice of logged-in user
   * - get relation 'wishes' to know whether this apar is favorite of logged-in user
   * @param production {String} The production Apar belongs to.
   * @param limitNum {number} The Maximum number of UserNotices to return.
   * @param skipNum {number} The Number of results to skip.
   * @param req {Request} The req object represents the HTTP request.
   * @param cb {Function} invoked when fetching succeeds or fails.  Upon
   *                   success, callback is invoked as cb(null, userNtfs),
   *                   where `userNtfs` is a Model UserNotices object.  Upon failure,
   *                   callback is invoked as cb(err) instead.
   * @throws void
   * @returns void
   */
  Notice.findByUser_v1 = (production, limitNum, skipNum, req, cb) => {
    const UserNotice = app.models.UserNotice;
    const Notice = app.models.Notice;
    const UserTag = app.models.UserTag;
    const Apar = app.models.Apar;
    const Tag = app.models.Tag;

    const userId = req.user.id;
    const limit = limitNum || 20;
    const skip = skipNum || 0;
/*
    co(function* doGetNoticeByUser() {
      // check whether production is valid
      const productions = ['DB2', 'CICS'];
      if (!_.includes(productions, production)) {
        const err1 = new Error('Invalid production');
        err1.statusCode = 400;
        err1.code = 'PARAMETERS_INVALID';
        throw err1;
      }

      // find inverse UserTag list
      const inverseUserTags = yield UserTag.find({
        fields: 'tagId',
        where: {
          ownerId: userId,
        },
      });

      const tagIds = _.map(inverseUserTags, 'tagId');
      console.log('tagIds', tagIds);

      // find apars by production
      const apars = yield Apar.find({
        fields: ['aparId', 'production'],
        where: {
          production,
        },
        include: [{
          relation: 'wishes',
          scope: {
            where: {
              ownerId: userId,
            },
          },
        }, {
          relation: 'tags',
          where: {
            // FIXME: issue here
            tagId: {
              nin: tagIds,
            },
          },
        }],
      });
      // remove apar.tags is empty and get aparId list
      const aparIds = _.map(_.filter(apars, (o) => (o.tags().length > 0)), 'aparId');

      const userNtfs = _.map(yield UserNotice.find({
        order: 'id DESC',
        where: {
          ownerId: userId,
        },
        include: {
          relation: 'notice',
          scope: {
            where: {
              aparId: {
                inq: aparIds,
              },
            },
          },
        },
      }), (o) => {
        if (o.notice()) {
          const apar = _.find(apars, {
            aparId: o.notice().aparId,
          });

          return {
            id: o.id,
            type: o.notice().type,
            title: o.notice().title,
            abstract: o.notice().abstract,
            rating: o.notice().rating,
            aparId: o.notice().aparId,
            created: o.notice().created,
            isRead: o.isRead,
            favorite: apar.wishes().length > 0,
          };
        }
        return null;
      });

      return _.slice(_.filter(userNtfs, (o) => (o)), skip, skip + limit);
    }).then((userNtfs) => {
      cb(null, userNtfs);
    }).catch((err) => {
      const error = new VError(err, 'Notice Find By User Error');
      logger.writeErr(JSON.stringify(error), error.stack);
      process.nextTick(() => cb(errorHelper.formatError(err)));
    });
*/
    // check whether production is valid
    const productions = ['DB2', 'CICS'];
    if (!_.includes(productions, production)) {
      const err1 = new Error('Invalid production');
      err1.statusCode = 400;
      err1.code = 'PARAMETERS_INVALID';
      process.nextTick(() => cb(errorHelper.formatError(err1)));
    }

    const ds = UserNotice.dataSource;
    let sqlCommand = '';
    if (ds.name === 'mysql') {
      sqlCommand = 'SELECT DISTINCT `Notice`.`type`, `Notice`.`title`, `Notice`.`abstract`, \
        `Notice`.`rating`, `Notice`.`aparId`, `Notice`.`created`, `UserNotice`.`isRead`, \
        CASE WHEN `Wish`.`id` IS NULL THEN 0 ELSE 1 END AS `favorite` \
        FROM `UserNotice` JOIN `Notice` ON `UserNotice`.`noticeId` = `Notice`.`id` AND `UserNotice`.`ownerId` = ? \
        JOIN `Apar` ON `Notice`.`aparId` = `Apar`.`aparId` AND `Apar`.`production` = ? \
        LEFT JOIN `Wish` ON `Apar`.`aparId` = `Wish`.`aparId` AND `UserNotice`.`ownerId` = `Wish`.`ownerId` \
        JOIN `AparTag` ON `AparTag`.`aparId` = `Apar`.`aparId` \
        JOIN `Tag` ON `AparTag`.`tagId` = `Tag`.`id` AND `Tag`.`id` NOT IN \
        (SELECT `UserTag`.`tagId` FROM `UserTag` WHERE `UserTag`.`ownerId` = ?) \
        ORDER BY `UserNotice`.`id` DESC LIMIT ? OFFSET ?';
    } else {
      sqlCommand = 'SELECT DISTINCT "UserNotice"."id", "Notice"."type", "Notice"."title", \
        "Notice"."abstract", "Notice"."rating", "Notice"."aparId", "Notice"."created", \
        "UserNotice"."isRead", CASE WHEN "Wish"."id" IS NULL THEN 0 ELSE 1 END AS "favorite" \
        FROM "UserNotice" JOIN "Notice" ON "UserNotice"."noticeId" = "Notice"."id" AND "UserNotice"."ownerId" = ? \
        JOIN "Apar" ON "Notice"."aparId" = "Apar"."aparId" AND "Apar"."production" = ? \
        LEFT JOIN "Wish" ON "Apar"."aparId" = "Wish"."aparId" AND "UserNotice"."ownerId" = "Wish"."ownerId" \
        JOIN "AparTag" ON "AparTag"."aparId" = "Apar"."aparId"  \
        JOIN "Tag" ON "AparTag"."tagId" = "Tag"."id" AND "Tag"."id" NOT IN  \
        (SELECT "UserTag"."tagId" FROM "UserTag" WHERE "UserTag"."ownerId" = ?) \
        ORDER BY "UserNotice"."id" DESC LIMIT ? OFFSET ?';
    }

    ds.connector.query(sqlCommand, [userId, production, userId, limit, skip],
      (err2, notices) => {
        if (err2) {
          const error = new VError(err2, 'Notice Find By User Error');
          logger.writeErr(JSON.stringify(error), error.stack);
          cb(errorHelper.formatError(err2));
        }
        cb(null, notices);
      });
  };

  Notice.remoteMethod(
    'findByUser_v1', {
      accepts: [{
        arg: 'production',
        type: 'string',
        required: true,
      }, {
        arg: 'limit',
        type: 'number',
      }, {
        arg: 'skip',
        type: 'number',
      }, {
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
        path: '/v1/me/:production',
        verb: 'get',
      },
    }
  );

  /**
   * @description
   * find and returns count number of unread notice of logged-in user
   * @param req {Request} The req object represents the HTTP request.
   * @param cb {Function} invoked when fetching succeeds or fails.  Upon
   *                   success, callback is invoked as cb(null, count),
   *                   Upon failure, callback is invoked as cb(err) instead.
   * @throws void
   * @returns void
   */
  Notice.unReadCount_v1 = (req, cb) => {
    /*
      let UserNotice = app.models.UserNotice;
      UserNotice.unReadCount(userId)
          .then(function(count) {
              cb(null, count);
          }).catch(function(err) {
              let error = new VError(err, 'Notice Unread Count Error');
              logger.writeErr(JSON.stringify(error), error.stack);

              cb(errorHelper.formatError(err));
          }); */

    const UserNotice = app.models.UserNotice;
    const Account = app.models.Account;
    const userId = req.user.id;

    co(function* doGetUnreadCount() {
      // get user email address
      const user = yield Account.findById(userId);

      // get notifications
      const userNtfs = yield UserNotice.find({
        where: {
          ownerId: userId,
          isRead: false,
        },
        include: {
          relation: 'notice',
          scope: {
            include: {
              relation: 'apar',
              scope: {
                fields: [],
                include: {
                  relation: 'tags',
                  scope: {
                    include: {
                      relation: 'users',
                      scope: {
                        where: {
                          email: user.email,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const ntfs = [];
      if (userNtfs) {
        userNtfs.forEach((result) => {
          const n = result.notice();

          /*
          console.log('wishes = ' + JSON.stringify(n.apar().wishes()));
          if (n.apar().tags() && n.apar().tags().length > 0) {
              console.log('tags = ' + JSON.stringify(n.apar().tags()));
              for (let i = 0; i < n.apar().tags().length; ++i) {
                  let tag = n.apar().tags()[i];
                  if (tag.users() && tag.users().length > 0) {
                      console.log('users = ' + JSON.stringify(tag.users()));
                  }
              }
          } */

          let shouldDisplay = false;
          if (n && n.apar()) {
            if (!n.apar().tags() || n.apar().tags().length === 0) shouldDisplay = true;
            else {
              for (let i = 0; i < n.apar().tags().length; i += 1) {
                const tag = n.apar().tags()[i];
                if (!tag.users() || tag.users().length === 0) {
                  shouldDisplay = true;
                  break;
                }
              }
            }
          }

          if (shouldDisplay) {
            ntfs.push(n);
          }
        });
      }

      return ntfs;
    }).then((userNtfs) => {
      cb(null, userNtfs.length);
    }).catch((err) => {
      const error = new VError(err, 'Notice Unread Count Error');
      logger.writeErr(JSON.stringify(error), error.stack);

      cb(errorHelper.formatError(err));
    });
  };

  Notice.remoteMethod(
    'unReadCount_v1', {
      accepts: [{
        arg: 'req',
        type: 'object',
        http: {
          source: 'req',
        },
      }],
      returns: {
        arg: 'count',
        type: 'number',
      },
      http: {
        path: '/v1/me/unread',
        verb: 'get',
      },
    }
  );
};
