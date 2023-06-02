const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Friends", {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    friendsList: {
      type: DataTypes.ARRAY(DataTypes.STRING()),
    },
  });
};
