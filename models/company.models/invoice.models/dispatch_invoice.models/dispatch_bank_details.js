const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");
const DispatchInvoice = require("./dispatch_invoice.model");
const patternInvoice = require("../pattern_invoice.models/pattern_invoice");
const DispatchBankDetails = sequelize.define(
  "DispatchBankDetails",
  {
    dispatch_bank_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
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
    beneficiary_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branch_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    branch_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_no: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    account_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ifsc_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    swift_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_ad_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["dispatch_bank_id"],
      },
    ],
    tableName: "dispatch_bank_details",
  }
);

DispatchInvoice.hasOne(DispatchBankDetails, {
  foreignKey: "dispatch_invoice_id",
});
patternInvoice.hasOne(DispatchBankDetails, {
  foreignKey: "pattern_invoice_id",
});
DispatchBankDetails.sync({ alter: false }).then().catch();

module.exports = DispatchBankDetails;
