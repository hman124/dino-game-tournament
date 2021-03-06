const db = require("./database.js");
const crypto = require("crypto");

class User {
  constructor(screenName, currentGame) {
    this.userId = crypto.randomBytes(8).toString("hex");
    this.screenName = screenName;
    this.currentGame = currentGame;
    db.first("Select numUsers From Games Where gamePin=?", [this.gamePin]).then(
      data => {
        console.log(data);
        if (data.length) {
          this.gameUsers = data.numUsers;
        } else {
          this.gameUsers = 0;
        }
      }
    );
  }
  insertDb() {
    db.run(
      "Insert Into Users (userId, screenName, currentGame) Values (?,?,?)",
      [this.userId, this.screenName, this.currentGame]
    );
    db.run("Update Games Set numUsers=? Where gamePin=?", [
      this.gameUsers + 1,
      this.currentGame
    ]);
  }
}

class Game {
  constructor(user) {
    this.hostId = user.userId;
    this.gamePin = crypto.randomBytes(2).toString("hex");
  }
  insertDb() {
    db.run(
      "Insert Into Games (hostId, gamePin, numUsers, isStarted) Values (?,?,0,false)",
      [this.hostId, this.gamePin]
    );
    db.run(
      "Update Users Set currentGame=? Where userId=?",
      [this.gamePin, this.hostId]
    );
  }
}

async function gameExists(gamePin) {
  let data = await db.first("Select gamePin From Games Where gamePin=?", [
    gamePin
  ]);
  if (data.length) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  User: User,
  Game: Game,
  gameExists: gameExists
};
