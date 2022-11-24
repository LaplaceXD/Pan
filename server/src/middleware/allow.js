const { Prohibited } = require("../../helpers/errors");

const allow = (...permissions) => {
  return async (req, _, next) => {
    for (const cb of permissions) {
      let authorized = await cb(req, req.auth);
      if (authorized) return next();
    }

    throw new Prohibited();
  };
};

module.exports = allow;
