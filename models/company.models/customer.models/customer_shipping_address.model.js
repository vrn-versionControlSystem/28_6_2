const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const Customer = require("./customer.model");

const CustomerShippingAddress = sequelize.define(
  "CustomerShippingAddress",
  {
    shipping_address_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    contact_person: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zip_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
        fields: ["shipping_address_id"],
      },
    ],
    tableName: "customer_shipping_address",
  }
);

Customer.hasMany(CustomerShippingAddress, { foreignKey: "customer_id" });

CustomerShippingAddress.sync({ alter: false }).then().catch();

module.exports = CustomerShippingAddress;
