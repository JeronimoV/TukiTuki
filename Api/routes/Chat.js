const app = require("express").Router();
const {
  createChat,
  createMessage,
  getChatInfo,
  getChatParticipantInfo,
  getAllChatMessage,
  getAllUserChats,
} = require("../controllers/Chat");

app.get("/:chatId", getChatInfo);

app.get("/friend", getChatParticipantInfo);

app.get("/allchats/:userId", getAllUserChats);

app.get("/message/:chatId", getAllChatMessage);

app.post("/", createChat);

app.post("/message", createMessage);

module.exports = app;
