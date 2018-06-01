'use strict';

const helper = {};
exports.helper = helper;

helper.formatError = (error) => {
  if (!error) {
    return null;
  }

  switch (error.statusCode) {
    case 500:
      {
        const err = new Error('Internal Error');
        err.status = 500;
        return err;
      }
      // break;

    case 400:
      {
        const err = new Error(error.message);
        err.status = 400;
        return err;
      }
      // break;
    case 401:
      {
        const err = new Error('Unauthorized');
        err.status = 401;
        return err;
      }
      // break;

    case 422:
      {
        const err = new Error();
        if (error.details && error.details.messages) {
          const messages = error.details.messages;
          for (const key of Object.keys(messages)) {
            const has = Object.prototype.hasOwnProperty;
            if (has.call(messages, key)) {
              err.message = `property: '${key}', reason: ${messages[key][0]}`;
            }
          }
        }

        err.status = 422;
        return err;
      }
      // break;
    default:
      return error;
  }
};
