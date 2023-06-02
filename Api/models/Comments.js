const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Comments", {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    textContent: {
      type: DataTypes.STRING(),
    },
    imageContent: {
      type: DataTypes.STRING(),
    },
  });
};
