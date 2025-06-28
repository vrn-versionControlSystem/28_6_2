const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");
const DispatchLocation = require("./dispatch_location");
const Product = require("../../product.models/product.model");
// const Po = require("../../po_and_poList.models/po.model");
// const DispatchInvoice = require("./dispatch_invoice.model");

const DispatchList = sequelize.define(
  "DispatchList",
  {
    dispatch_list_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    dispatch_invoice_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    item_quantity: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    item_weight: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },

    // location id
    dispatch_location_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    // box id
    dispatch_box_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    // Po & Po list related details
    po_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    po_list_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    project_no: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    serial_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "po serial number",
    },
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "po number",
    },
    delivery_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    raw_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    row_charges: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    machining_charges: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },

    machining_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    // Product related details

    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    pump_model: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    unit_measurement: {
      type: DataTypes.ENUM("no", "mm", "kg"),
      validate: {
        isInEnum(value) {
          if (!["no", "mm", "kg"].includes(value)) {
            throw new Error("Invalid product unit measurement yo man");
          }
        },
      },
      defaultValue: "no",
    },
    hsn_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    gst_percentage: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["dispatch_list_id"],
      },
    ],
    tableName: "dispatch_lists",
  }
);

DispatchLocation.hasMany(DispatchList, { foreignKey: "dispatch_location_id" });
// DispatchList.belongsTo(DispatchList, { foreignKey: "dispatch_invoice_id" });
DispatchList.belongsTo(Product, { foreignKey: "product_id" });

DispatchList.sync({ alter: false }).then().catch();

module.exports = DispatchList;
