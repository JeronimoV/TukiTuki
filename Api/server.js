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

conn
  .sync({ force: false })
  .then(() => {
    const actualServer = server.listen(PORT, () => {
      console.log("Server connected");
    });
    const allUsers = [];

    const io = require("socket.io")(actualServer, {
      cors: { origin: "*" },
    });

    // Manejar las conexiones entrantes y mensajes WebSocket
    io.on("connection", (socket) => {
      console.log("ALL USERS", allUsers);
      console.log("me inicie");
      let WSuserId = null;
      socket.on("user_connected", async (message) => {
        const userInfo = { socket: socket.id, id: message.id };
        const coincidences = allUsers.find((value) => value.id === message.id);
        if (!coincidences) {
          WSuserId = allUsers.push(userInfo);
        }

        // modificar
        socket.on("send_message", async (message) => {
          console.log("Este es el mensaje que llego", message);

          const newMessage = await Message.create({
            ChatId: message.chatId,
            UserId: message.userId,
            message: message.message,
          });

          let usersToSend = [];
          let chat = await Chat.findOne({ where: { id: message.chatId } });
          usersToSend.push(chat.UserId, chat.FriendId);

          console.log("Este es el mensaje creado", newMessage);
          const usersSocket = allUsers.filter(
            (value) =>
              value.id === usersToSend[0] || value.id === usersToSend[1]
          );
          usersSocket.forEach((value) => {
            io.to(value.socket).emit("update_Message", newMessage);
          });
        });
      });
      socket.on("create_chat", async (message) => {
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

        console.log(actualUser, actualFriend);

        if (!actualChat) {
          newChat = await Chat.create({
            UserId: actualUser.id,
            FriendId: actualFriend.id,
          });
          console.log("ENTREEEEEEEEEEEEE");
        } else {
          newChat = actualChat;
        }

        console.log("ESTE ES EL CHAAAAAT", newChat);

        const usersToSend = allUsers.filter(
          (value) => value.id === actualUser.id || value.id === actualFriend.id
        );

        console.log("USERS A MANDAR", usersToSend);

        usersToSend.forEach((value) => {
          console.log("SOY EL VALUEEEEEEEE", value.socket);
          io.to(value.socket).emit("update_chats", newChat);
        });
      });

      socket.on("disconnect", () => {
        console.log("Me cerre");
        if (WSuserId !== null) {
          console.log(WSuserId);
          allUsers.splice(WSuserId - 1, 1);
          console.log(allUsers);
        }
      });
    });
  })
  .catch((err) => console.log(err));
