'use strict';

// const loopback = require('loopback');
const app = require('../../server/server');
const co = require('co');

module.exports = (UserNotice) => {
  UserNotice.unReadCount = (userId) => (
    new Promise((resolve, reject) => {
      const Account = app.models.Account;

      co(function* doGerUnreadCount() {
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
          // assert(Array.isArray(userNtfs));

          userNtfs.forEach((result) => {
            const n = result.notice();

            /*
            console.log("wishes = " + JSON.stringify(n.apar().wishes()));
            if (n.apar().tags() && n.apar().tags().length > 0) {
                console.log("tags = " + JSON.stringify(n.apar().tags()));
                for (let i = 0; i < n.apar().tags().length; ++i) {
                    let tag = n.apar().tags()[i];
                    if (tag.users() && tag.users().length > 0) {
                        console.log("users = " + JSON.stringify(tag.users()));
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
        resolve(userNtfs.length);
      }).catch((err) => {
        reject(err);
      });
    })
  );
};
