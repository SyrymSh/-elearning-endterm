const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    })
  })
);

app.use(express.static("src/public"));

module.exports = app;
