const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Message", {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING(),
    },
  });
};
