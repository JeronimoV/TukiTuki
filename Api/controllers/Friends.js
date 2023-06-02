const { User, Friends, FriendRequests } = require("../database");
const { Op } = require("sequelize");

const verifyFriends = async (req, res) => {
  const { friendId, userId } = req.body;
  try {
    const allFriends = await Friends.findAll({
      where: { [Op.and]: [{ FriendId: friendId }, { UserId: userId }] },
    });

    const allRequests = await FriendRequests.findAll({
      where: {
        [Op.or]: [
          { UserApplicant: friendId, UserRequested: userId },
          { UserApplicant: userId, UserRequested: friendId },
        ],
      },
    });

    if (allFriends.length > 0 || allRequests.length > 0) {
      res.status(200).json("true");
    } else {
      res.status(200).json("false");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const getFriends = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await Friends.findAll({
      where: { UserId: userId },
    });

    if (!user) throw new Error("User not found");

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const setFriend = async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    const [actualUser, actualFriend] = await Promise.all([
      User.findOne({ where: { id: userId } }),
      User.findOne({ where: { id: friendId } }),
    ]);

    await actualUser.addUserFriends(actualFriend);
    await actualFriend.addUserFriends(actualUser);

    res.status(200).json("Success");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const removeFriend = async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    const actualUser = await User.findOne({ where: { id: userId } });
    const actualFriend = await User.findOne({ where: { id: friendId } });

    await actualUser.removeUserFriends(actualFriend);
    await actualFriend.removeUserFriends(actualUser);

    res.status(200).json("Success");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const sendFriendRequest = async (req, res) => {
  const { UserApplicant, UserRequested } = req.body;
  try {
    if (!UserApplicant || !UserRequested) {
      throw new Error("You need to send all the data!");
    }
    await FriendRequests.create({
      UserApplicant: UserApplicant,
      UserRequested: UserRequested,
    });

    res.status(200).json("Success");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const getUserRequests = async (req, res) => {
  const { userId } = req.params;
  try {
    const actualRequests = await FriendRequests.findAll({
      where: { UserRequested: userId },
    });
    const dataToSend = [];
    await Promise.all(
      actualRequests && actualRequests.length
        ? actualRequests.map(async (value) => {
            let user = await User.findOne({
              where: { id: value.UserApplicant },
            });
            dataToSend.push({
              nickname: user.nickname,
              picture: user.picture,
              id: user.id,
              requestId: value.id,
            });
          })
        : null
    );
    res.status(200).json(dataToSend);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const friendRequestResponse = async (req, res) => {
  const { response, requestId, UserApplicant, UserRequested } = req.body;
  try {
    if (!response) {
      throw new Error("You need to send all the data!");
    }

    const [actualApplicant, actualRequested, request] = await Promise.all([
      User.findOne({ where: { id: UserApplicant } }),
      User.findOne({ where: { id: UserRequested } }),
      FriendRequests.findOne({ where: { id: requestId } }),
    ]);

    if (response === "Accept") {
      await actualApplicant.addUserFriends(actualRequested);
      await actualRequested.addUserFriends(actualApplicant);
      await request.destroy();
    } else if (response === "Reject") {
      await request.destroy();
    } else {
      throw new Error("The request was diferent that Reject or Accept!");
    }
    res.status(200).json("Success");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

module.exports = {
  verifyFriends,
  getFriends,
  setFriend,
  removeFriend,
  sendFriendRequest,
  getUserRequests,
  friendRequestResponse,
};
