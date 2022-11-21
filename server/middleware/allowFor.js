const { Prohibited } = require("../helpers/errors");

const allowFor = (...allowedRoles) => {
  return (req, _, next) => {
    if (!allowedRoles.includes(req.auth.role)) throw new Prohibited();

    next();
  };
};

module.exports = allowFor;
