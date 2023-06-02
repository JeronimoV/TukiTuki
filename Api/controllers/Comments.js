const { Posts, User, Comments } = require("../database");

const getPostComments = async (req, res) => {
  //id del post
  const { postId, page } = req.body;
  try {
    const actualPage = page * 5;
    const actualPost = await Posts.findOne({ where: { id: postId } });
    if (!actualPost) throw new Error("The post doesnt exist");
    const allComments = await Comments.findAll({
      where: { PostId: postId },
      offset: actualPage,
      limit: 5,
    });
    if (allComments.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(allComments);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const createComment = async (req, res) => {
  const { userId, postId, textContent, imageContent } = req.body;
  try {
    if (!imageContent && !textContent)
      throw new Error("You need to send some data!");
    const actualPost = await Posts.findOne({ where: { id: postId } });
    if (!actualPost) throw new Error("Post doesnt exist!");
    const actualUser = await User.findOne({ where: { id: userId } });
    if (!actualUser) throw new Error("The user doesnt exist!");
    await Comments.create({
      textContent: textContent,
      imageContent: imageContent,
      UserId: userId,
      PostId: postId,
    });
    res.status(200).json("Success!");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const deleteComment = async (req, res) => {
  const { userId, commentId } = req.body;
  try {
    const actualUser = await User.findOne({ where: { id: userId } });
    if (!actualUser) throw new Error("The user doesnt exist!");
    const actualComment = await Comments.findOne({ where: { id: commentId } });
    if (!actualComment) throw new Error("The comment doesnt exist!");
    if (actualUser.id !== actualComment.UserId) {
      throw new Error("This is not your comment!");
    }
    await actualComment.destroy();
    res.status(200).json("Deleted!");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const updateComment = async (req, res) => {
  const { userId, commentId, newCommentText, newCommentImage } = req.body;
  try {
    if (!newCommentImage && !newCommentText)
      throw new Error("You need to send some data!");
    const actualUser = await User.findOne({ where: { id: userId } });
    if (!actualUser) throw new Error("The user doesnt exist!");
    const actualComment = await Comments.findOne({ where: { id: commentId } });
    if (!actualComment) throw new Error("The comment doesnt exist!");
    await actualComment.update({
      textContent: newCommentText,
      imageContent: newCommentImage,
    });
    res.status(200).json("Edited!");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

module.exports = {
  getPostComments,
  createComment,
  deleteComment,
  updateComment,
};
