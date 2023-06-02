const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Chat", {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(),
    },
  });
};
