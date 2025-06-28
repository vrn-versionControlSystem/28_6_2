const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");
const DispatchInvoice = require("./dispatch_invoice.model");
const PatternInvoice = require("../pattern_invoice.models/pattern_invoice");

const DispatchShippingAddress = sequelize.define(
  "DispatchShippingAddress",
  {
    dispatch_shipping_address_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    dispatch_buyer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    dispatch_invoice_id: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },
    pattern_invoice_id: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },
    shipping_address_id: {
      type: DataTypes.UUID,
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
    contact_person: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["dispatch_shipping_address_id"],
      },
    ],
    tableName: "dispatch_shipping_addresses",
  }
);

DispatchInvoice.hasOne(DispatchShippingAddress, {
  foreignKey: "dispatch_invoice_id",
});
PatternInvoice.hasOne(DispatchShippingAddress, {
  foreignKey: "pattern_invoice_id",
});

DispatchShippingAddress.sync({ alter: false }).then().catch();

module.exports = DispatchShippingAddress;
