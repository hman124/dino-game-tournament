const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const users = require("./users.js");
const db = require("./database.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

app.get("/api/newGame", (req, res) => {
  let user = new users.User(req.query.user);
  user.insertDb();
  let game = new users.Game(user);
  game.insertDb();
  res.send(game);
});

app.get("/game/join", async (req, res) => {
  let exists = await users.gameExists(req.query.gamePin);
  //var exists = true;
  if (exists) {
    let user = new users.User(req.query.user, req.query.gamePin);
    user.insertDb();
    res.cookie("gamePin", user.currentGame);
    res.redirect(307, "/game/wait");
  } else {
    res.send("Game Doesn't Exist");
  }
});

app.get("/api/Listdb", async (req, res) => {
  let data = await db.list();
  res.send(data);
});

app.get("/game/wait", async (req, res) => {
  let data = await users.gameState(req.cookies.gamePin);
  if (!data) {
    res.send(data);
  } else {
    res.redirect(307, "/game/play");
  }
});

app.get("/game/play", async (req, res) => {
  let data = await users.gameState(req.cookies.gamePin);
  if (data) {
    res.send(data);
  } else {
    res.redirect(307, "/game/wait");
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
