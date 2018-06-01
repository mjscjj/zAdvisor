'use strict';

module.exports = (app) => {
  const Role = app.models.Role;
  Role.registerResolver('admin', (role, context, cb) => {
    const user = context.remotingContext.req.user;
    if (!user || !user.email) {
      return process.nextTick(() => cb(null, false));
    }

    return process.nextTick(() => cb(null, user.role === 'ROLE_ADMIN'));
  });
};
