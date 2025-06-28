const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const { sequelize } = require("../../../configs/database");

const MaterProductPlanner = sequelize.define(
  "MaterProductPlanner",
  {
    serial_number: {
      type: DataTypes.STRING,
      primaryKey: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    delivery_date: {
      type: DataTypes.DATE,
    },
    accept_delivery_date: {
      type: DataTypes.DATE,
    },
    list_status: {
      type: DataTypes.STRING,
    },
    project_no: {
      type: DataTypes.STRING,
    },
    item_quantity: {
      type: DataTypes.INTEGER,
    },
    product_name: {
      type: DataTypes.STRING,
    },
    drawing_number: {
      type: DataTypes.STRING,
    },
    revision_number: {
      type: DataTypes.STRING,
    },
    material_grade: {
      type: DataTypes.STRING,
    },
    item_code: {
      type: DataTypes.STRING,
    },
    number: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
    },
    poa: {
      type: DataTypes.STRING,
    },
    customer_name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "masterproductplaner",
    primaryKey: false,
  }
);

module.exports = MaterProductPlanner;
