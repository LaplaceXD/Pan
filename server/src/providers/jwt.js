const config = require("config");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const Redis = require("ioredis");

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

function verify(token) {
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

class JTIList {
  constructor(name, redis) {
    this.listName = name;
    this.redis = redis;
  }

  async add(jti, exp = null) {
    const key = `${this.listName}:${jti}`;
    await this.redis.set(key, "OK");
    if (exp) await this.redis.expireat(key, exp);
  }

  async contains(jti) {
    const value = await this.redis.exists(`${this.listName}:${jti}`);
    return value === 1;
  }
}

const redis = new Redis({ ...config.get("redis") });
const blackList = new JTIList("jti_blacklist", redis);
const refreshList = new JTIList("jti_refreshlist", redis);

class TokenPair {
  constructor({ jti, rti = null, access, refresh = null }) {
    this.jti = jti;
    this.rti = rti;
    this.access = access;
    this.refresh = refresh;
  }

  get payload() {
    return jwt.decode(this.access);
  }

  async blackList() {
    const { exp } = jwt.decode(await sign({}, token.REFRESH));
    await blackList.add(this.jti, exp);
  }

  async invalidateRefresh() {
    const { exp } = jwt.decode(this.refresh);
    await refreshList.add(this.rti, exp);
  }

  async isRefreshed() {
    return refreshList.contains(this.rti);
  }

  async isBlackListed() {
    return blackList.contains(this.jti);
  }

  static async create(payload, jti = uuid()) {
    const rti = uuid();

    return new TokenPair({
      jti,
      rti,
      access: await sign({ ...payload, jti }, token.ACCESS),
      refresh: await sign({ jti, rti }, token.REFRESH),
    });
  }

  static from(access, refresh = null) {
    const { jti: accessJti } = jwt.decode(access);
    if (!accessJti) return null;

    if (refresh) {
      const { jti: refreshJti, rti } = jwt.decode(refresh);
      if (!refreshJti || !rti || accessJti !== refreshJti) return null;

      return new TokenPair({ access, jti: accessJti, rti, refresh });
    }

    return new TokenPair({ access, accessJti });
  }
}

module.exports = {
  verify,
  TokenPair,
  blackList,
};
