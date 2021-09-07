const { DataTypes } = require("sequelize");
const db = require('../db');

const Users = db.define("user", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    required: true,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM,
    values: ["user", "admin"],
    allownull: false,
    defaultValue: "user"
  },
});

module.exports = Users;