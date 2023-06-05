const { conn } = require("./database");
const app = require("./routes/index");
const express = require("express");
const server = express();
const cors = require("cors");
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
    const actualServer = server.listen(3000, () => {
      console.log("Server connected");
    });
    const allUsers = [];
    const allUsersChats = [];

    const io = require("socket.io")(actualServer, {
      cors: { origin: "*" },
    });

    // Manejar las conexiones entrantes y mensajes WebSocket
    io.on("connection", (socket) => {
      console.log("me inicie");
      let WSuserId = null;
      socket.on("user_connected", async (message) => {
        const userInfo = { socket: socket, id: message.id };
        const coincidences = allUsers.find((value) => value.id === message.id);
        if (!coincidences) {
          WSuserId = allUsers.push(userInfo);
        }

        // modificar
        socket.on("create_chat", async (message) => {
          console.log(message);
          const newMessage = await Message.create({
            ChatId: message.chatId,
            UserId: message.userId,
            message: message.message,
          });

          let usersToSend = [];
          let chat = await Chat.findOne({ where: { id: message.chatId } });
          usersToSend.push(chat.UserId, chat.FriendId);
          const usersSocket = allUsers.filter(
            (value) =>
              value.id === usersToSend[0] || value.id === usersToSend[1]
          );
          usersSocket.forEach((value) => value.socket.emit(newMessage));
        });
      });
      socket.on("send_message", async (message) => {
        const [actualUser, actualFriend, actualChat] = await Promise.all([
          User.findOne({ where: { id: message.userId } }),
          User.findOne({ where: { id: message.friendId } }),
          Chat.findOne({
            where: {
              [Op.and]: [
                { FriendId: message.friendId },
                { UserId: message.userId },
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
          (value) => value.id === actualUser.id || value.id === actualFriend.id
        );

        usersToSend.forEach((value) => value.socket.emit(newChat));
      });

      socket.on("disconnect", () => {
        console.log("Me cerre");
        if (WSuserId !== null) {
          console.log(WSuserId);
          allUsers.splice(WSuserId - 1, 1);
        }
      });
    });
  })
  .catch((err) => console.log(err));
