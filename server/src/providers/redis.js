const config = require("config");
const Redis = require("ioredis");

function connect() {
  return new Redis({
    ...config.get("redis"),
  });
}

module.exports = {
  connect,
};
