const { conn } = require("./database");
const app = require("./routes/index");
const express = require("express");
const server = express();
const cors = require("cors");
const { WebSocketServer } = require("ws");
const { Message, Chat, User } = require("./database");
const { Op } = require("sequelize");
require("dotenv").config();
const { PORT, PORTWS1, PORTWS2 } = process.env;

server.use(express.json());
server.use(cors());

server.use("/", app);

/* socket.on("chatUpdate", async (data) => {
    const actualInfo = JSON.parse(data);
    const userInfo = { socket: socket, id: actualInfo.id };
    const coincidences = allUsers.find((value) => value.id === actualInfo.id);
    if (!coincidences) {
      WSuserId = allUsers.push(userInfo);
    }
    if (actualInfo.getChats) {
      const [actualUser, actualFriend] = await Promise.all([
        User.findOne({ where: { id: actualInfo.userId } }),
        User.findOne({ where: { id: actualInfo.friendId } }),
      ]);

      const newChat = await Chat.create({
        UserId: actualUser.id,
        FriendId: actualFriend.id,
      });

      const usersToSend = allUsers.filter(
        (value) => value.id === actualUser.id || value.id === actualFriend.id
      );

      const serialize = JSON.stringify(newChat);

      usersToSend.forEach((value) => value.socket.send(serialize));
    }
  });*/

conn
  .sync({ force: false })
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server connected");
    });
  })
  .catch((error) => console.log(error));

const allUsers = [];
const allUsersChats = [];

conn
  .sync({ force: false })
  .then(() => {
    const httpServer = server.listen(3001, () => {
      console.log("Server connected");
    });

    // Crear una instancia de WebSocketServer y adjuntarla al servidor HTTP existente
    const wsServer = new WebSocketServer({ server: httpServer });

    // Manejar las conexiones entrantes y mensajes WebSocket
    wsServer.on("connection", (socket) => {
      console.log("me inicie");
      let WSuserId = null;
      socket.on("message", async (message) => {
        const actualInfo = JSON.parse(message.toString());
        const userInfo = { socket: socket, id: actualInfo.id };
        const coincidences = allUsers.find(
          (value) => value.id === actualInfo.id
        );
        if (!coincidences) {
          WSuserId = allUsers.push(userInfo);
        }
        if (actualInfo.chatId && !actualInfo.getChats) {
          const newMessage = await Message.create({
            ChatId: actualInfo.chatId,
            UserId: actualInfo.userId,
            message: actualInfo.message,
          });

          const toSend = JSON.stringify(newMessage);
          let usersToSend = [];
          let chat = await Chat.findOne({ where: { id: actualInfo.chatId } });
          usersToSend.push(chat.UserId, chat.FriendId);
          const usersSocket = allUsers.filter(
            (value) =>
              value.id === usersToSend[0] || value.id === usersToSend[1]
          );
          usersSocket.forEach((value) => value.socket.send(toSend));
        }
      });

      socket.on("close", () => {
        console.log("Me cerre");
        if (WSuserId !== null) {
          console.log(WSuserId);
          allUsers.splice(WSuserId - 1, 1);
        }
      });
    });

    wsServer.on("error", () => {
      console.log("Oh no hermano, un error :o");
    });
  })
  .catch((error) => console.log(error));

conn
  .sync({ force: false })
  .then(() => {
    const httpServer = server.listen(3002, () => {
      console.log("Server connected");
    });

    // Crear una instancia de WebSocketServer y adjuntarla al servidor HTTP existente
    const wsServer = new WebSocketServer({ server: httpServer });
    wsServer.on("connection", (socket) => {
      console.log("me inicie");
      let WSuserId = null;
      socket.on("message", async (data) => {
        const actualInfo = JSON.parse(data);
        const userInfo = { socket: socket, id: actualInfo.id };
        const coincidences = allUsersChats.find(
          (value) => value.id === actualInfo.id
        );
        if (!coincidences) {
          WSuserId = allUsersChats.push(userInfo);
        }
        if (actualInfo.getChats) {
          const [actualUser, actualFriend, actualChat] = await Promise.all([
            User.findOne({ where: { id: actualInfo.userId } }),
            User.findOne({ where: { id: actualInfo.friendId } }),
            Chat.findOne({
              where: {
                [Op.and]: [
                  { FriendId: actualInfo.friendId },
                  { UserId: actualInfo.userId },
                ],
              },
            }),
          ]);

          let newChat = null;

          if (!actualChat) {
            newChat = await Chat.create({
              UserId: actualUser.id,
              FriendId: actualFriend.id,
            });
          } else {
            newChat = actualChat;
          }

          const usersToSend = allUsersChats.filter(
            (value) =>
              value.id === actualUser.id || value.id === actualFriend.id
          );

          const serialize = JSON.stringify(newChat);

          usersToSend.forEach((value) => value.socket.send(serialize));
        }
      });
      socket.on("close", () => {
        console.log("Me cerre");
        if (WSuserId !== null) {
          console.log(WSuserId);
          allUsers.splice(WSuserId - 1, 1);
        }
      });
    });
  })
  .catch((error) => console.log(error));
