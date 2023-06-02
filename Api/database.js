require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { USER, PASSWORD, HOST, DATABASE, PORT } = process.env;

const sequelize = new Sequelize(
  "postgres://default:8atvpTXjy9hS@ep-small-wave-621632.us-east-1.postgres.vercel-storage.com:5432/verceldb"
);

const modelList = [];
const pathModelsFiles = [];
const requires = [];

const pathModels = path.join(__dirname, "models");
const models = fs.readdirSync(pathModels);
models.forEach((value) => modelList.push(value));
modelList.forEach((value) =>
  pathModelsFiles.push(path.join(__dirname, "/models", value))
);
pathModelsFiles.forEach((value) => requires.push(require(value)));
requires.forEach((value) => value(sequelize));

const {
  User,
  Reactions,
  Posts,
  Message,
  Friends,
  Favorites,
  Chat,
  Comments,
  FriendRequests,
} = sequelize.models;

//User

User.belongsToMany(User, {
  through: Friends,
  as: "UserFriends",
  foreignKey: "UserId",
  otherKey: "FriendId",
});

User.belongsToMany(User, {
  through: Chat,
  as: "UserChat",
  foreignKey: "UserId",
  otherKey: "FriendId",
});

User.belongsToMany(User, {
  through: FriendRequests,
  as: "UserFriendRequest",
  foreignKey: "UserApplicant",
  otherKey: "UserRequested",
});

User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(Posts);
Posts.belongsTo(User);

User.hasMany(Comments);
Comments.belongsTo(User);

User.hasMany(Favorites);
Favorites.belongsTo(User);

User.hasMany(Reactions);
Reactions.belongsTo(User);

//Posts

Posts.hasMany(Favorites);
Favorites.belongsTo(Posts);

Posts.hasMany(Comments);
Comments.belongsTo(Posts);

Posts.hasMany(Reactions);
Reactions.belongsTo(Posts);

//Chat

Chat.hasMany(Message);
Message.belongsTo(Chat);

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
