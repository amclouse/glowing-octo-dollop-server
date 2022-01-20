const { DataTypes } = require("sequelize");
const db = require("../db");

const Applications = db.define("applications", {
  companyName: {
    type: DataTypes.STRING,
  },
  position: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  }
});

module.exports = Applications;
