const db = require("../../providers/db");

async function getAllAlbums() {
  const conn = await db.connect();

  const [entries] = await conn.execute("SELECT * FROM album");
  return entries;
}

async function addAlbum({ month, year, album }) {
  const conn = await db.connect();

  const [{ insertId: no }] = await conn.execute(
    "INSERT INTO album (Album, Month, Year) VALUES (?, ?, ?);",
    [album, month, year]
  );

  return {
    no,
    album,
    month,
    year,
  };
}

module.exports = {
  getAllAlbums,
  addAlbum,
};
