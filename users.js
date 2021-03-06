const db = require("./database.js");
const crypto = require("crypto");

class User {
  constructor(screenName, currentGame) {
    this.userId = crypto.randomBytes(8).toString("hex");
    this.screenName = screenName;
    this.currentGame = currentGame;
    if (this.currentGame) {
      db.first("Select numUsers From Games Where gamePin=?", [
        this.currentGame
      ]).then(data => {
        this.gameUsers = data.numUsers;
        console.log(data.numUsers);
      });
    }
  }
  insertDb() {
    db.run(
      "Insert Into Users (userId, screenName, currentGame) Values (?,?,?)",
      [this.userId, this.screenName, this.currentGame]
    );
    if (this.currentGame) {
      db.run("Update Games Set numUsers=? Where gamePin=?", [
        this.gameUsers + 1,
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
