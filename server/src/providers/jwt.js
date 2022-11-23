const config = require("config");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");

function sign(payload, tokenType) {
  const { secret, ...options } = config.get("jwt");

  return new Promise((resolve, reject) => {
    let expiresIn = options.expiresIn[tokenType];
    if (!expiresIn) reject("Invalid Token Type.");

    const jti = uuid();
    jwt.sign({ jti, ...payload }, secret, { ...options, expiresIn }, function (err, token) {
      if (err) reject(err);
      resolve({ token, jti });
    });
  });
}

function verify(token) {
  const { secret, expiresIn, ...options } = config.get("jwt");

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, function (err, payload) {
      if (err instanceof jwt.TokenExpiredError) {
        resolve({ payload: null, isExpired: true });
      } else if (err) {
        reject(err);
      } else {
        resolve({ payload, isExpired: false });
      }
    });
  });
}

function decode(token) {
  return jwt.decode(token);
}

module.exports = {
  sign,
  verify,
  decode,
};
