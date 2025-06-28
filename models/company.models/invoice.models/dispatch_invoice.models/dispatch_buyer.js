const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");
const DispatchInvoice = require("./dispatch_invoice.model");
const PatternInvoice = require("../pattern_invoice.models/pattern_invoice");
const DispatchBuyer = sequelize.define(
  "DispatchBuyer",
  {
    dispatch_buyer_id: {
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
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vender_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    pan: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    gst_no: {
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
        fields: ["dispatch_buyer_id"],
      },
    ],
    tableName: "dispatch_buyers",
  }
);

DispatchInvoice.hasOne(DispatchBuyer, { foreignKey: "dispatch_invoice_id" });
PatternInvoice.hasOne(DispatchBuyer, { foreignKey: "pattern_invoice_id" });

DispatchBuyer.sync({ alter: false }).then().catch();

module.exports = DispatchBuyer;
