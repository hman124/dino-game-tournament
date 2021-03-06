const db = require("./database.js");
const crypto = require("crypto");

class User {
  constructor(screenName, currentGame) {
    this.userId = crypto.randomBytes(8).toString("hex");
    this.screenName = screenName;
    this.currentGame = currentGame;
  }
  insertDb() {
    db.run(
      "Insert Into Users (userId, screenName, currentGame) Values (?,?,?)",
      [this.userId, this.screenName, this.currentGame]
    );
    if (this.currentGame) {
      console.log(typeof this.gameUsers);
      db.run("Update Games Set numUsers=numUsers+1 Where gamePin=?", [
        this.currentGame
      ]);
    }
  }
}

class Game {
  constructor(user) {
    this.hostId = user.userId;
    this.gamePin = crypto.randomBytes(2).toString("hex");
  }
  insertDb() {
    db.run(
      "Insert Into Games (hostId, gamePin, numUsers, isStarted) Values (?,?,1,false)",
      [this.hostId, this.gamePin]
    );
    db.run("Update Users Set currentGame=? Where userId=?", [
      this.gamePin,
      this.hostId
    ]);
  }
}

async function gameExists(gamePin) {
  let data = await db.first("Select gamePin From Games Where gamePin=?", [
    gamePin
  ]);
  return !!data.gamePin;
}

async function gameState(gamePin) {
  let data = await db.first("Select isStarted From Games Where gamePin=?", [
    gamePin
  ]);
  return !!parseInt(data.isStarted);
}

async function isHost(userId, gamePin) {
  let data = await db.first(
    "Select * From Games Where hostId=? AND gamePin=?",
    [userId, gamePin]
  );
  return !!data;
}

module.exports = {
  User: User,
  Game: Game,
  gameExists: gameExists,
  gameState: gameState
};
