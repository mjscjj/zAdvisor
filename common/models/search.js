'use strict';

const co = require('co');
const app = require('../../server/server');
const fs = require('fs');
const logger = require('../../server/utils/logHelper').helper;
const errorHelper = require('../../server/utils/logHelper').helper;
const VError = require('verror');

module.exports = (Search) => {
  Search.add_v1 = (data, cb) => {
    app.si.add(data, null, (err) => {
      if (err) {
        const error = new VError(err, 'Search Engine Add Error');
        logger.writeErr(JSON.stringify(error), error.stack);
        cb(errorHelper.formatError(err));
      }
      cb(null, 'Search Index Add Success');
  });
  };

  Search.remoteMethod(
    'add_v1', {
      accepts: {
        arg: 'data',
        type: 'object',
        http: {
          source: 'body',
        },
      },
      returns: {
        type: 'object',
        root: true,
      },
      http: {
        path: '/v1/add',
        verb: 'post',
        status: 201,
      },
    }
  );

  Search.delete_v1 = (docId, cb) => {
    app.si.del(docId, (err) => {
      if (err) {
        const error = new VError(err, 'Search Engine Delete Error');
        logger.writeErr(JSON.stringify(error), error.stack);
        cb(errorHelper.formatError(err));
      }
      cb(null, true);
  });
  };

  Search.remoteMethod(
    'delete_v1', {
      accepts: {
        arg: 'docId',
        type: 'string',
        required: true,
      },
      returns: {
        type: 'object',
        root: true,
      },
      http: {
        path: '/v1/:docId',
        verb: 'del',
        status: 204,
      },
    }
  );

  Search.flush_v1 = (cb) => {
    app.si.flush((err) => {
      if (err) {
        const error = new VError(err, 'Search Engine Flush Error');
        logger.writeErr(JSON.stringify(error), error.stack);
        cb(errorHelper.formatError(err));
      }

      cb(null, true);
  });
  };

  Search.remoteMethod(
    'flush_v1', {
      returns: {
        type: 'object',
        root: true,
      },
      http: {
        path: '/v1/flush',
        verb: 'get',
        status: 204,
      },
    }
  );

  Search.info_v1 = (cb) => {
    app.si.tellMeAboutMySearchIndex((err, info) => {
      if (err) {
        const error = new VError(err, 'Search Engine Info Error');
        logger.writeErr(JSON.stringify(error), error.stack);
        cb(errorHelper.formatError(err));
      }

      return cb(null, info);
  });
  };

  Search.remoteMethod(
    'info_v1', {
      returns: {
        type: 'object',
        root: true,
      },
      http: {
        path: '/v1/info',
        verb: 'get',
      },
    }
  );

  Search.build_v1 = (cb) => {
    const Apar = app.models.Apar;

    co(function* scanApars() {
      const apars = yield Apar.find({});
      if (apars.length < 1) return null;

      logger.writeInfo(`find apars to build index: ${apars.length}`);
      for (let i = 0; i < apars.length; i += 1) {
        // if (apars[i].summary.indexOf('DATA\r') !== -1) console.log(apars[i].summary.replace(/\r/g, ' '));
        app.si.add({
          aparId: apars[i].aparId,
          abstract: apars[i].abstract.replace(/\r/g, ' '),
          description: apars[i].description.replace(/\r/g, ' '),
          triggers: apars[i].triggers.replace(/\r/g, ' '),
          summary: apars[i].summary.replace(/\r/g, ' '),
          conclusion: apars[i].conclusion.replace(/\r/g, ' '),
          closeDate: apars[i].closeDate.toISOString(),
        }, null, (err1) => {
          if (err1) logger.writeErr(`si add ${apars[i].aparId} fail`, err1.stack);
      });
      }

      return true;
    }).then(() => (
      cb(null, true)
    ), (err) => (
      cb(err)
    ));
  };

  Search.remoteMethod(
    'build_v1', {
      returns: {
        type: 'object',
        root: true,
      },
      http: {
        path: '/v1/build',
        verb: 'get',
        status: 201,
      },
    }
  );

  Search.export_v1 = (cb) => {
    app.si.snapShot((rs) => {
      rs.pipe(fs.createWriteStream('backup.gz'))
      .on('close', () => (
      cb(null, true)
    ))
  .on('error', (err) => (
      cb(err)
    ));
  });
  };

  Search.remoteMethod(
    'export_v1', {
      returns: {
        type: 'object',
        root: true,
      },
      http: {
        path: '/v1/export',
        verb: 'get',
      },
    }
  );
};
