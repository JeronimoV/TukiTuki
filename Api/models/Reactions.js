const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Reactions", {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    reaction: {
      type: DataTypes.ENUM("Like", "Dislike", "Nothing"),
      defaultValue: "Nothing",
      allowNull: false,
    },
  });
};
