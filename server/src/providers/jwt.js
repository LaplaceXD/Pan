const config = require("config");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const Redis = require("ioredis");

const redis = new Redis({ ...config.get("redis") });
const token = require("../constants/token");

function sign(payload, tokenType) {
  const { secret, ...options } = config.get("jwt");

  return new Promise((resolve, reject) => {
    let expiresIn = options.expiresIn[tokenType];
    if (!expiresIn) reject("Invalid Token Type.");

    jwt.sign(payload, secret, { ...options, expiresIn }, function (err, token) {
      if (err) reject(err);
      resolve(token);
    });
  });
}

class Token {
  constructor({ jti, access, refresh }) {
    this.jti = jti;
    this.access = access;
    this.refresh = refresh;
  }

  credentials() {
    return jwt.decode(this.access);
  }

  async save() {
    await redis.set(`jwt_token:${this.jti}`, this.refresh);
  }

  async delete() {
    await redis.del(`jwt_token:${this.jti}`);
  }

  async isRefreshable() {
    if (!this.refresh) return false;

    const { isExpired } = await Token.verify(this.refresh);
    if (isExpired) {
      // delete the refresh token from redis if it is already
      // expired, since it would no longer be used
      await this.delete();
      return false;
    }

    return true;
  }

  static async fromPayload(payload) {
    const jti = uuid();

    return new Token({
      jti,
      access: await sign({ ...payload, jti }, token.ACCESS),
      refresh: await sign({ jti }, token.REFRESH),
    });
  }

  static async fromAccessToken(access) {
    const { jti } = jwt.decode(access);
    if (!jti) return null;

    return new Token({ jti, access, refresh: await redis.get(`jwt_token:${jti}`) });
  }

  static async verify(token) {
    const { secret, expiresIn, ...options } = config.get("jwt");

    return new Promise((resolve, _) => {
      jwt.verify(token, secret, options, function (err, payload) {
        if (err instanceof jwt.TokenExpiredError) {
          resolve({ payload: null, isExpired: true, isInvalid: false });
        } else if (err) {
          resolve({ payload: null, isExpired: false, isInvalid: true });
        } else {
          resolve({ payload, isExpired: false, isInvalid: false });
        }
      });
    });
  }
}

module.exports = Token;
