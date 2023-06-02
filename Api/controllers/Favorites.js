const { User, Posts, Favorites } = require("../database");
const { Op } = require("sequelize");

const getUserFavorites = async (req, res) => {
  //User id
  const { id } = req.params;
  try {
    const allFavorites = await Favorites.findAll({ where: { UserId: id } });
    if (!allFavorites) throw new Error("This user doesnt have favorites!");
    res.status(200).json(allFavorites);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const setFavorite = async (req, res) => {
  const { postId, userId } = req.body;
  try {
    const actualPost = await Posts.findOne({ where: { id: postId } });
    if (!actualPost) throw new Error("The post doesnt exist!");
    const actualFavorite = await Favorites.findOne({
      where: { [Op.and]: [{ UserId: userId }, { PostId: postId }] },
    });
    if (!actualFavorite) {
      await Favorites.create({
        UserId: userId,
        PostId: postId,
      });
    } else {
      actualFavorite.destroy();
    }
    res.status(200).json("All fine!");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

module.exports = {
  getUserFavorites,
  setFavorite,
};
