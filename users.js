const db = require("./database.js");
const crypto = require("crypto");

class User {
  constructor(screenName, currentGame) {
    this.userId = crypto.randomBytes(8).toString("hex");
    this.screenName = screenName;
    this.currentGame = currentGame;
  }
  insertDb() {
    var isHost = !this.currentGame
    db.run(
      "Insert Into Users (userId, screenName, currentGame, isHost) Values (?,?,?,?)",
      [this.userId, this.screenName, this.currentGame, isHost]
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

async function getUser(userId) {
  var userData = await db.first("Select * From Users Where userId=?", [userId]);
  return userData;
}

module.exports = {
  User: User,
  Game: Game,
  gameExists: gameExists,
  gameState: gameState
};
