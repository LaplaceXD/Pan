const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(15);
  return await bcrypt.hash(password, salt);
}

module.exports = {
  hashPassword,
};
