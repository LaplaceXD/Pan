const mysql = require("mysql2/promise");
const config = require("config");

async function connect() {
  return await mysql.createConnection({
    host: config.get("db.host"),
    user: config.get("db.user"),
    database: config.get("db.database"),
    password: config.get("db.password"),
  });
}

module.exports = {
  connect,
};
