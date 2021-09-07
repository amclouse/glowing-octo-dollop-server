const { DataTypes } = require("sequelize");
const db = require("../db");

const Applications = db.define("applications", {
  companyName: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.UUID
  }
});

module.exports = Applications;
