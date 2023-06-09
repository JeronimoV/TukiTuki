const app = require("express").Router();
const {
  searchBar,
  getUserIdWithEmail,
  getOneUser,
  getUserProfile,
  getUserReactions,
  logOutUser,
  isUserLogged,
  createUser,
  loginUser,
  updateUser,
  updatePassword,
} = require("../controllers/User");

app.get("/search/:search", searchBar);

app.get("/id/:email", getUserIdWithEmail);

app.get("/:id", getOneUser);

app.get("/profile/:nickname", getUserProfile);

app.get("/myfavorites/:id", getUserReactions);

app.post("/delete", logOutUser);

app.post("/verify", isUserLogged);

app.post("/login", loginUser);

app.post("/", createUser);

app.post("/login", loginUser);

app.put("/", updateUser);

app.put("/password", updatePassword);

module.exports = app;
