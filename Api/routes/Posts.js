const app = require("express").Router();
const {
  getAllPost,
  getFriendsPosts,
  createPost,
  deletePost,
  updatePost,
} = require("../controllers/Posts");

app.get("/", getAllPost);

app.get("/friends/:userId", getFriendsPosts);

app.post("/", createPost);

app.delete("/", deletePost);

app.put("/", updatePost);

module.exports = app;
