const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./imdb-large.sqlite3.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQlite database.");
});

module.exports = db;
