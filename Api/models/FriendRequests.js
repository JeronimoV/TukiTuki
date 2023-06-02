const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("FriendRequests", {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  });
};
