const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const { sequelize } = require("../../../configs/database");
const Product = require("../product.models/product.model");

const Stocks = sequelize.define(
  "Stocks",
  {
    stock_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    opening_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    current_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    closing_stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    inward_stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    dispatched: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    production: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    // status: {
    //   type: DataTypes.ENUM("pending", "delivered", "processing", "rejected"),
    //   allowNull: false,
    //   validate: {
    //     isInEnum(value) {
    //       if (
    //         !["pending", "delivered", "processing", "rejected"].includes(value)
    //       ) {
    //         throw new Error("Invalid po status");
    //       }
    //     },
    //   },
    //   defaultValue: "pending",
    // },
    added_by_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    added_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "stocks",
  }
);

Stocks.belongsTo(Product, { foreignKey: "product_id" });
Stocks.sync({ alter: false }).then().catch();

module.exports = Stocks;
