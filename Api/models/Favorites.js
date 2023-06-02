const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Favorites", {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  });
};
