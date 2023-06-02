const app = require("express").Router();
const { getPostReaction, setReaction } = require("../controllers/Reactions");

app.get("/:id", getPostReaction);

app.post("/", setReaction);

module.exports = app;
