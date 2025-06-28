const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");
const DispatchInvoice = require("./dispatch_invoice.model");
const PatternInvoice = require("../pattern_invoice.models/pattern_invoice");

const DispatchShippingAndOtherDetails = sequelize.define(
  "DispatchShippingAndOtherDetails",
  {
    dispatch_shipping_and_other_details_id: {
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
    end_use_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    packing_details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    excise_document: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    freight: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shipping_term: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_term: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shipping_line: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shipping_insurance: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bill_type: {
      type: DataTypes.ENUM("NON GST", "IGST", "GST"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["NON GST", "IGST", "GST"].includes(value)) {
            throw new Error("Invalid GST type");
          }
        },
      },
      defaultValue: "NON GST",
    },
    c_gst: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    s_gst: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    i_gst: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    e_way_bill_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    packing_charges: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    fright_charges: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    other_charges: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    convert_rate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    indexes: [],
    tableName: "dispatch_shipping_and_other_details",
  }
);

DispatchInvoice.hasOne(DispatchShippingAndOtherDetails, {
  foreignKey: "dispatch_invoice_id",
});

PatternInvoice.hasOne(DispatchShippingAndOtherDetails, {
  foreignKey: "pattern_invoice_id",
});
DispatchShippingAndOtherDetails.sync({ alter: false }).then().catch();

module.exports = DispatchShippingAndOtherDetails;
