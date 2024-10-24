require("dotenv").config();
const { Sequelize } = require("sequelize");
const config = require("./config");
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];
module.exports = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);
