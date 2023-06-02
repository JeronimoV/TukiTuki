const { Posts, User, Reactions } = require("../database");
const { Op } = require("sequelize");

const getPostReaction = async (req, res) => {
  //post id
  const { id } = req.params;
  try {
    const actualPostReactions = await Reactions.findOne({
      where: { PostId: id },
    });
    if (!actualPostReactions)
      throw new Error("This id post doesnt have any reactions!");
    res.status(200).json(actualPostReactions);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const setReaction = async (req, res) => {
  const { userId, postId, reaction } = req.body;
  try {
    const actualUser = await User.findOne({ where: { id: userId } });
    const actualPost = await Posts.findOne({ where: { id: postId } });
    if (!actualPost || !actualUser) {
      throw new Error("User or Post doesnt exist!");
    }
    const actualReaction = await Reactions.findOne({
      where: { [Op.and]: [{ PostId: postId }, { UserId: userId }] },
    });
    if (!actualReaction) {
      await Reactions.create({
        reaction: reaction,
        UserId: userId,
        PostId: postId,
      });
    } else {
      if (actualReaction.reaction === reaction) {
        actualReaction.destroy();
      } else {
        actualReaction.update({
          reaction: reaction,
        });
      }
    }

    res.status(200).json("Success");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

module.exports = {
  getPostReaction,
  setReaction,
};
