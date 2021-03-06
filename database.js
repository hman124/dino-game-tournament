const dbFile = "./.data/sqlite.db";
const fs = require("fs");
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE Games (gamePin TEXT, numUsers INT, hostId TEXT, isStarted BOOL)"
    );
    db.run(
      "CREATE TABLE Users (userId TEXT, screenName TEXT, currentGame TEXT)"
    );
  } else {
    console.log("Database ready to go!");
  }
});

function dbAll(query, stmts) {
  return new Promise((res, rej) => {
    db.all(query, ...stmts, (err, rows) => {
      if (err) {
        rej(err);
      } else {
        res(rows);
      }
    });
  });
}

function dbRun(query, stmts) {
  return new Promise((res, rej) => {
    db.run(query, ...stmts, (err) => {
      if(err) {
        rej(err);
      } else {
        res();
      }
    })
  });
}

module.exports = {
  run: dbRun,
  all: dbAll
}
