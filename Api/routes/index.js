const express = require("express");
const { verifyToken } = require("../util/jwtEncrypt");
const app = express.Router();
const User = require("./User");
const Posts = require("./Posts");
const Reactions = require("./Reactions");
const Comments = require("./Comments");
const Favorites = require("./Favorites");
const Friends = require("./Friends");
const Chats = require("./Chat");

app.use("/users", User);

app.use("/posts", Posts);

app.use("/reactions", Reactions);

app.use("/comments", Comments);

app.use("/favorites", Favorites);

app.use("/friends", Friends);

app.use("/chat", Chats);

module.exports = app;
