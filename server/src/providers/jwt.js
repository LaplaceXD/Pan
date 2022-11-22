const config = require("config");
const jwt = require("jsonwebtoken");

function sign(payload, options) {
  return jwt.sign(payload, config.get("jwtSecret"), options);
}

function verify(token, options) {
  let resp = { error: null, payload: null };

  try {
    resp.payload = jwt.verify(token, config.get("jwtSecret"), options);
  } catch (err) {
    resp.error = err;
  }

  return resp;
}

module.exports = {
  sign,
  verify,
};
