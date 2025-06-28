const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");
const DispatchInvoice = require("./dispatch_invoice.model");
const patternInvoice = require("../pattern_invoice.models/pattern_invoice");

const DispatchShippingDetails = sequelize.define(
  "DispatchShippingDetails",
  {
    dispatch_shipping_details_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
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
    pre_carriage_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    place_of_receipt: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    port_of_discharge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country_of_goods: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    port_of_loading: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    final_destination: {
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
        fields: ["dispatch_shipping_details_id"],
      },
    ],
    tableName: "dispatch_shipping_details",
  }
);

DispatchInvoice.hasOne(DispatchShippingDetails, {
  foreignKey: "dispatch_invoice_id",
});
patternInvoice.hasOne(DispatchShippingDetails, {
  foreignKey: "pattern_invoice_id",
});

DispatchShippingDetails.sync({ alter: false }).then().catch();

module.exports = DispatchShippingDetails;
