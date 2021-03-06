const db = require("./database.js");
const crypto = require("crypto");

class User {
  constructor(screenName, currentGame) {
    this.userId = crypto.randomBytes(8).toString("hex");
    this.screenName = screenName;
    this.currentGame = currentGame;
    db.first("Select numUsers From Games Where gamePin=?", [this.gamePin]).then(
      data => {
        if (data.length) {
          this.gameUsers = data.numUsers;
        }
      }
    );
  }
  insertDb() {
    db.run(
      "Insert Into Users (userId, screenName, currentGame) Values (?,?,?)"[
        (this.userId, this.screenName, this.currentGame)
      ]
    );
    db.run(
      "Insert Into Games (numUsers) Where gamePin=? Values (?)",
      this.currentGame,
      this.gameUsers + 1
    );
  }
}

async function gameExists(gamePin) {
  let data = await db.first("Select gamePin From Games Where gamePin=?", [gamePin]);
  if(data.length) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  User: User,
  gameExists: gameExists
};
