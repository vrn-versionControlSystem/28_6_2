const { DataTypes } = require("sequelize");

const { sequelize } = require("../../../configs/database");

const Product = require("../product.models/product.model");

const Stock = sequelize.define(
  "Stock",
  {
    stock_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    stock_cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock_expiry_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    stock_storage_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock_entry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    added_by: {
      type: DataTypes.ENUM("super-admin", "admin"),
      allowNull: true,
      validate: {
        isInEnum(value) {
          if (!["super-admin", "admin"].includes(value)) {
            throw new Error("Invalid admins type");
          }
        },
      },
      defaultValue: "admin",
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    indexes: [],
    tableName: "stock",
  }
);

Stock.belongsTo(Product, { foreignKey: "product_id", targetKey: "product_id" });

Stock.sync({ alter: false }).then().catch();

module.exports = Stock;
