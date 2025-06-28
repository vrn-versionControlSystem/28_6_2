const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database");

const Logger = sequelize.define(
  "Logger",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    req_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    req_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    route: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
    tableName: "logger",
  }
);

Logger.sync({ alter: false }).then().catch();

module.exports = Logger;
