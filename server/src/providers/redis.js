const config = require("config");
const Redis = require("ioredis");

const redis = new Redis({ ...config.get("redis") });

async function set(key, value) {
  return await redis.set(key, value);
}

async function getAndDelete(key) {
  const data = await redis.get(key);
  await redis.del(key);

  return data;
}

module.exports = {
  set,
  getAndDelete,
};
