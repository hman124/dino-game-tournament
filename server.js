const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const users = require("./users.js");
const db = require("./database.js");
const cookieParser = require("cookie-parser");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.get("/game/new", (req, res) => {
  let user = new users.User(req.query.user);
  user.insertDb();
  let game = new users.Game(user);
  game.insertDb();
  res.cookie("userId", user.userId);
  res.cookie("gamePin", game.gamePin);
  res.redirect(307, "/game/wait");
});

app.get("/game/join", async (req, res) => {
  let exists = await users.gameExists(req.query.gamePin);
  //var exists = true;
  if (exists) {
    let user = new users.User(req.query.user, req.query.gamePin);
    user.insertDb();
    res.cookie("gamePin", user.currentGame);
    res.cookie("userId", user.userId);
    res.redirect(307, "/game/wait");
  } else {
    res.send("Game Doesn't Exist");
  }
});

app.get("/api/listdb", async (req, res) => {
  let data = await db.list();
  res.send(data);
});

app.get("/game/info", async (req, res) => {
  res.send(req.cookies);
});

app.get("/game/wait", async (req, res) => {
  let data = await users.gameState(req.cookies.gamePin);
  if (!data) {
    var userState = await users.getUser(req.cookies.userId);
    if (userState.isHost) {
      res.sendFile(__dirname + "/views/host/wait.html");
    } else {
      res.sendFile(__dirname + "/views/player/wait.html");
    }
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

app.get("/api/cleardb", async (req, res) => {
  db.run("Delete From Games Where 1");
  res.send("hi");
});

io.on("connect", socket => {
  socket.on("linkGame", user => {
    console.log(user);
    socket.join(user[0]);
    io.to(user[0]).emit("newUser", "Yes");
  });
});

var listener = http.listen(process.env.PORT, () => {
  //console.log(`Your app is listening on port ${listener.address().port}`);
});
