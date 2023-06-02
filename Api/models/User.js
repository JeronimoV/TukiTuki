const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(),
    },
    lastName: {
      type: DataTypes.STRING(),
    },
    email: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(),
    },
    picture: {
      type: DataTypes.TEXT(),
    },
    age: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(),
    },
    accountAccess: {
      type: DataTypes.ENUM("Banned", "NotBanned"),
      defaultValue: "NotBanned",
    },
    description: {
      type: DataTypes.STRING,
    },
  });
};
