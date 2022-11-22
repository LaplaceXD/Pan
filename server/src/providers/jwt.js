const config = require("config");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");

const redis = require("./redis");
const client = redis.connect();

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

      // check if it is currently in the redis cache
      client.get(`jwt_label:${payload.jti}`, function (err, result) {
        if (err) reject(err);
        else if (result) reject("Invalidated token.");

        resolve(payload);
      });
    });
  });
}

function destroy(token) {
  return new Promise((resolve, reject) => {
    verify(token)
      .then(({ jti }) => {
        const key = `jwt_label:${jti}`;

        client.set(key, true, function (err, _) {
          if (err) reject(err);
          resolve("OK");
        });
      })
      .catch((_) => {
        resolve("OK");
      });
  });
}

module.exports = {
  sign,
  verify,
  destroy,
};
