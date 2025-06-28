const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const Product = require("./product.model");
const Customer = require("../customer.models/customer.model");

const Pattern = sequelize.define(
  "Pattern",
  {
    pattern_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    availability: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    customer_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    storage_location: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
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
    indexes: [
      {
        unique: true,
        fields: ["pattern_id"],
      },
    ],
    tableName: "patterns",
  }
);

Product.belongsTo(Pattern, { foreignKey: "pattern_id" });
Pattern.belongsTo(Customer, { foreignKey: "customer_id" });

Pattern.sync({ alter: false }).then().catch();

module.exports = Pattern;
