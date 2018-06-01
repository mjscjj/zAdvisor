'use strict';

const VError = require('verror');
const app = require('../../server/server');
const assert = require('assert');
const co = require('co');
const logger = require('../../server/utils/logHelper').helper;
const errorHelper = require('../../server/utils/logHelper').helper;

module.exports = (Wish) => {
  Wish.disableRemoteMethodByName('find');
  Wish.disableRemoteMethodByName('findById');
  Wish.disableRemoteMethodByName('findOne');

  // disable count & exists
  Wish.disableRemoteMethodByName('confirm');
  Wish.disableRemoteMethodByName('count');
  Wish.disableRemoteMethodByName('exists');

  Wish.disableRemoteMethodByName('create');
  Wish.disableRemoteMethodByName('upsert');
  Wish.disableRemoteMethodByName('deleteById');
  Wish.disableRemoteMethodByName('updateAll');
  Wish.disableRemoteMethodByName('updateAttributes');
  Wish.disableRemoteMethodByName('createChangeStream');

  Wish.disableRemoteMethodByName('replaceById');
  Wish.disableRemoteMethodByName('replaceOrCreate');
  Wish.disableRemoteMethodByName('upsertWithWhere');

  // Relation account is used for Role $owner
  Wish.disableRemoteMethodByName('__get__account');
  Wish.disableRemoteMethodByName('__get__apar');

  Wish.findByUser_v1 = (limit, skip, req, cb) => {
    const userId = req.user.id;
    Wish.find({
      order: 'created DESC',
      limit: !limit ? 20 : limit,
      skip: !skip ? 0 : skip,
      where: {
        ownerId: userId,
      },
      include: {
        relation: 'apar',
        scope: {
          fields: ['abstract', 'hiper'],
          include: 'pes',
        },
      },
    }).then((wishes) => {
      cb(null, wishes);
    }).catch((err) => {
      const error = new VError(err, 'Wish Find By User Error');
      logger.writeErr(JSON.stringify(error), error.stack);

      cb(errorHelper.formatError(err));
    });
  };

  Wish.remoteMethod(
    'findByUser_v1', {
      accepts: [{
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
        path: '/v1/me',
        verb: 'get',
      },
    }
  );

  Wish.afterRemote('findByUser_v1', (ctx, wishes, next) => {
    if (wishes) {
      assert(Array.isArray(wishes));

      const list = [];
      wishes.forEach((w) => {
        const apar = w.apar();
        list.push({
          id: w.id,
          ownerId: w.ownerId,
          aparId: w.aparId,
          created: w.created,
          abstract: apar.abstract,
          type: (apar.pes() && apar.pes().length >= 1) ? 'Pe' : 'Hiper',
        });
      });
      ctx.result = list;
      next();
    }
  });

  Wish.createByApar_v1 = (aparId, req, cb) => {
    const Apar = app.models.Apar;
    const userId = req.user.id;

    co(function* doCreateByApar() {
      const apar = yield Apar.findById(aparId);

      if (!apar) {
        const err1 = new Error('Apar not found');
        err1.statusCode = 400;
        err1.code = 'APAR_NOT_FOUND';
        throw err1;
      }

      let wish = yield Wish.findOne({
        where: {
          ownerId: userId,
          aparId,
        },
      });

      if (!wish) {
        wish = yield Wish.create({
          ownerId: userId,
          aparId,
          created: Date.now(),
        });
      }

      return wish;
    }).then((val) => {
      cb(null, val);
    }, (err) => {
      const error = new VError(err, 'Wish Create By Apar Error');
      logger.writeErr(JSON.stringify(error), error.stack);
      cb(errorHelper.formatError(err));
    });
  };

  Wish.remoteMethod(
    'createByApar_v1', {
      accepts: [{
        arg: 'aparId',
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
        path: '/v1/me/:aparId',
        verb: 'post',
        status: 201,
      },
    }
  );

  Wish.deleteByApar_v1 = (aparId, req, cb) => {
    const userId = req.user.id;

    co(function* doDeleteByApar() {
      const wish = yield Wish.findOne({
        where: {
          ownerId: userId,
          aparId,
        },
      });

      if (!wish) {
        const err2 = new Error('Wish not found');
        err2.statusCode = 400;
        err2.code = 'WISH_NOT_FOUND';
        throw err2;
      }

      yield wish.destroy();

      return 'no content';
    }).then((val) => {
      cb(null, val);
    }, (err) => {
      const error = new VError(err, 'Wish Delete By Apar Error');
      logger.writeErr(JSON.stringify(error), error.stack);
      cb(errorHelper.formatError(err));
    });
  };

  Wish.remoteMethod(
    'deleteByApar_v1', {
      accepts: [{
        arg: 'aparId',
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
        type: 'string',
        root: true,
      },
      http: {
        path: '/v1/me/:aparId',
        verb: 'del',
        status: 204,
      },
    }
  );

  // example method for $owner. It can only work on one entry result like 'findById'
  /*
    Wish.removeById = function(id, cb) {
      Wish.findById(id)
      .then(function(wish){
        wish.destroy();
        cb(null, 'no content');
      }).catch(function(err){
        throw cb(err);
      });
    };
    Wish.remoteMethod(
      'removeById',
      {
        accepts: [
          {arg:'id', type:'number', required:true}
        ],
        returns: {type: 'string', 'root':true},
        http: {path: '/:id', verb: 'del', status: 204}
      }
    );
  */
};
