const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:jasper@localhost:5432/MyAppsDB');

module.exports = sequelize;