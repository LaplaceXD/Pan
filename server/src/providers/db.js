const mysql = require("mysql2/promise");
const config = require("config");

async function connect() {
  return await mysql.createConnection({
    ...config.get("db"),
    namedPlaceholders: true,
  });
}

module.exports = {
  connect,
};
