const { Posts, User, Friends, Reactions, Favorites } = require("../database");

//borrar getAllPost luego
const getAllPost = async (req, res) => {
  try {
    const allPosts = await Posts.findAll();
    res.status(200).json(allPosts);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const getFriendsPosts = async (req, res) => {
  const { userId } = req.params;
  try {
    const actualUser = await Friends.findAll({ where: { UserId: userId } });

    if (!actualUser || !actualUser.length)
      throw new Error(
        "You doesnt have friends! To see publications of your friends, you have to had friends :P"
      );

    console.log(actualUser);

    const allPosts = [];

    await Promise.all(
      actualUser.map(async (value) =>
        allPosts.push(
          Posts.findAll({
            where: { UserId: value.FriendId },
            include: [{ model: Reactions }, { model: Favorites }],
          })
        )
      )
    );

    const dataToSend = allPosts[0];

    dataToSend.sort((a, b) => {
      if (a.id < b.id) {
        return 1;
      } else {
        return -1;
      }
    });

    console.log(dataToSend);

    res.status(200).json(dataToSend);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const createPost = async (req, res) => {
  const { textContent, imageContent, userId } = req.body;
  try {
    if (!textContent && !imageContent)
      throw new Error("You need to send some data!");
    const newPost = await Posts.create({
      UserId: userId,
      textContent: textContent,
      imageContent: imageContent,
    });
    if (!newPost) throw new Error("Something goes wrong!");
    res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const deletePost = async (req, res) => {
  const { postId, userId } = req.body;
  try {
    const actualPost = await Posts.findOne({ where: { id: postId } });
    if (!actualPost) throw new Error("Post doesnt exist!");
    const actualUser = await User.findOne({ where: { id: userId } });
    if (!actualUser) throw new Error("The user doesnt exist!");
    if (actualPost.UserId !== userId)
      throw new Error("The user is not the own of the post!");
    await actualPost.destroy();
    res.status(200).json("Post deleted");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const updatePost = async (req, res) => {
  const { textContent, imageContent, postId, userId } = req.body;
  try {
    if (!textContent && !imageContent)
      throw new Error("You need to seend some data!");
    const actualPost = await Posts.findOne({ where: { id: postId } });
    if (!actualPost) throw new Error("Post doesnt exist!");
    const actualUser = await User.findOne({ where: { id: userId } });
    if (!actualUser) throw new Error("The user doesnt exist!");
    if (actualPost.UserId !== userId) {
      throw new Error("The user is not the own of the post!");
    }
    await actualPost.update({
      textContent: textContent,
      imageContent: imageContent,
    });
    res.status(200).json("Post updated!");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

module.exports = {
  getAllPost,
  getFriendsPosts,
  createPost,
  deletePost,
  updatePost,
};
