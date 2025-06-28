const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");
const DispatchInvoice = require("./dispatch_invoice.model");
const PatternInvoice = require("../pattern_invoice.models/pattern_invoice");

const DispatchConsignee = sequelize.define(
  "DispatchConsignee",
  {
    dispatch_consignee_id: {
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
    customer_code: {
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
        fields: ["dispatch_consignee_id"],
      },
    ],
    tableName: "dispatch_consignee",
  }
);

DispatchInvoice.hasOne(DispatchConsignee, {
  foreignKey: "dispatch_invoice_id",
});

PatternInvoice.hasOne(DispatchConsignee, {
  foreignKey: "pattern_invoice_id",
});

DispatchConsignee.sync({ alter: false }).then().catch();

module.exports = DispatchConsignee;
