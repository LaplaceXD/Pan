const config = require("config");
const jwt = require("jsonwebtoken");

function sign(payload, options) {
  return jwt.sign(payload, config.get("jwtSecret"), options);
}

module.exports = {
  sign,
};
