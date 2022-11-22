const config = require("config");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");

function sign(payload) {
  const { secret, ...options } = config.get("jwt");

  return new Promise((resolve, reject) => {
    jwt.sign({ ...payload, jti: uuid() }, secret, options, function (err, token) {
      if (err) reject(err);
      resolve(token);
    });
  });
}

function verify(token) {
  const { secret, ...options } = config.get("jwt");

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, function (err, payload) {
      if (err) reject(err);
      resolve(payload);
    });
  });
}

module.exports = {
  sign,
  verify,
};
