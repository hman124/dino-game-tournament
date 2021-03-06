const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const users = require("./users.js");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

app.get("/api/newGame", (req, res) => {
  
});

app.get("/api/newUser", (req, res) => {
  new users.User()
});

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});