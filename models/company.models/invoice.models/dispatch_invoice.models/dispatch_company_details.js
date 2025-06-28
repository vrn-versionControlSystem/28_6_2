const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");
const DispatchInvoice = require("./dispatch_invoice.model");

const PatternInvoice = require("../pattern_invoice.models/pattern_invoice");

const DispatchCompanyDetails = sequelize.define(
  "DispatchCompanyDetails",
  {
    dispatch_company_details_id: {
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
    iec_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gstin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    itc_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duty_drawback_serial_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state_code: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["dispatch_company_details_id"],
      },
    ],
    tableName: "dispatch_company_details",
  }
);

DispatchInvoice.hasOne(DispatchCompanyDetails, {
  foreignKey: "dispatch_invoice_id",
});
PatternInvoice.hasOne(DispatchCompanyDetails, {
  foreignKey: "pattern_invoice_id",
});

DispatchCompanyDetails.sync({ alter: false }).then().catch();

module.exports = DispatchCompanyDetails;
