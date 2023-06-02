const { Op } = require("sequelize");
const { Chat, User, Message } = require("../database");

const createChat = async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    const [actualUser, actualFriend] = await Promise.all([
      User.findOne({ where: { id: userId } }),
      User.findOne({ where: { id: friendId } }),
    ]);

    if (!actualFriend || !actualUser) {
      throw new Error("One or both users doesnt exist");
    }

    const newChat = await Chat.create({
      UserId: actualUser.id,
      FriendId: actualFriend.id,
    });

    res.status(200).json(newChat.id);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const createMessage = async (req, res) => {
  const { userId, message, chatId } = req.body;
  try {
    if (!userId || !message || !chatId) {
      throw new Error("You need to send all the data!");
    }

    const actualUser = await User.findOne({ where: { id: userId } });

    if (!actualUser) {
      throw new Error("User doesnt exist!");
    }

    await Message.create({
      message: message,
      UserId: userId,
      ChatId: chatId,
    });

    res.status(200).json("Success!");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const getChatInfo = async (req, res) => {
  const { chatId } = req.params;
  try {
    if (!chatId) {
      throw new Error("You need to send some data!");
    }

    const actualChat = await Chat.findOne({ where: { id: chatId } });

    if (!actualChat) {
      throw new Error("This chat doesnt exist!");
    }

    res.status(200).json(actualChat);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const getChatParticipantInfo = async (req, res) => {
  const { chatId } = req.params;
  try {
    if (!chatId) {
      throw new Error("You need to send some data!");
    }

    const actualChat = await Chat.findOne({ where: { id: chatId } });

    if (!actualChat) {
      throw new Error("This chat doesnt exist!");
    }

    const actualFriend = await User.findOne({
      where: { id: actualChat.FriendId },
    });

    res.status(200).json(actualFriend);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const getAllChatMessage = async (req, res) => {
  const { chatId } = req.params;
  try {
    let actualMessages = await Message.findAll({ where: { ChatId: chatId } });

    const actualChat = await Chat.findOne({ where: { id: chatId } });

    if (!actualMessages) {
      throw new Error("This user doesnt have messages!");
    }

    actualMessages = actualMessages.sort((a, b) => {
      if (a.id < b.id) {
        return 1;
      } else {
        return -1;
      }
    });

    res.status(200).json(actualMessages);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const getAllUserChats = async (req, res) => {
  const { userId } = req.params;
  try {
    const actualUser = await Chat.findAll({
      where: { [Op.or]: [{ FriendId: userId }, { UserId: userId }] },
    });

    res.status(200).json(actualUser);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

module.exports = {
  createChat,
  createMessage,
  getChatInfo,
  getChatParticipantInfo,
  getAllChatMessage,
  getAllUserChats,
};
