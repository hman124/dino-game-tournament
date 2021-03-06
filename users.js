const db = require("./database.js");

async function User(screenName, currentGame) {
  this.userId = crypto.randomBytes(8).toString("hex");
  this.screenName = screenName;
  this.currentGame = currentGame;
  this.gameUsers = await db.first("Select numUsers From Games Where gamePin=?", this.gamePin).numUsers;
  await db.run(
    "Insert Into Users (userId, screenName, currentGame) Values (?,?,?)"
    [this.userId, this.screenName, this.currentGame]
  );
  await db.run("Insert Into Games (numUsers) Values (?)", this.gameUsers+1);
  return;
}

module.exports = {
  User: User
}