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

app.get("/api/newGame", (req, res) => {});

app.get("/api/newUser", async (req, res) => {
  //let exists = await users.gameExists(req.query.gamePin);
  var exists = true;
  if (exists) {
    let user = new users.User(req.query.user, req.query.gamePin);
    user.insertDb();
    res.send(user);
  } else {
    res.send("Game Doesn't Exist");
  }
});

app.get("/api/Listdb", async (req, res) => {
  let data = await db.list();
  res.send(data);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
