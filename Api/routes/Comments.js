const app = require("express").Router();
const {
  getPostComments,
  createComment,
  deleteComment,
  updateComment,
} = require("../controllers/Comments");

app.post("/get", getPostComments);

app.post("/", createComment);

app.delete("/", deleteComment);

app.put("/", updateComment);

module.exports = app;
