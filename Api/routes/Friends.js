const {
  verifyFriends,
  getFriends,
  setFriend,
  removeFriend,
  sendFriendRequest,
  friendRequestResponse,
  getUserRequests,
} = require("../controllers/Friends");

const app = require("express").Router();

app.post("/verify", verifyFriends);

app.get("/:userId", getFriends);

app.post("/", setFriend);

app.get("/request/:userId", getUserRequests);

app.post("/send", sendFriendRequest);

app.post("/response", friendRequestResponse);

app.post("/remove", removeFriend);

module.exports = app;
