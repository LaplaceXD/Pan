const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function compare(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  compare,
};
