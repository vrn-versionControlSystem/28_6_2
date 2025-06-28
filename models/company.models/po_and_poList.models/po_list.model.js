const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const Po = require("./po.model");
const Product = require("../product.models/product.model");
const Drawing = require("../product.models/drawing.model");
const DispatchList = require("../invoice.models/dispatch_invoice.models/dispatch_list.model");

const PoList = sequelize.define(
  "PoList",
  {
    po_list_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    po_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    project_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    drawing_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    serial_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    unit_price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    net_amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    delivery_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accept_delivery_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    material_tc_verify: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    internal_inspection: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    ndt_requirement: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    final_inspection: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    heat_treatment: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    other: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    accept_description: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (!value) return this.setDataValue("accept_description", null);
        return this.setDataValue("accept_description", value);
      },
    },
    list_status: {
      type: DataTypes.ENUM("pending", "rejected", "accepted"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["pending", "rejected", "accepted"].includes(value)) {
            throw new Error("Invalid po list status");
          }
        },
      },
      defaultValue: "pending",
    },
    material_tc_verify_check: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    internal_inspection_check: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    ndt_requirement_check: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    final_inspection_check: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    heat_treatment_check: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    other_check: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },

    actual_raw_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },

    actual_machine_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },

    actual_quality_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["po_list_id"],
      },
    ],
    tableName: "po_lists",
  }
);

DispatchList.belongsTo(PoList, { foreignKey: "po_list_id" });

PoList.belongsTo(Drawing, { foreignKey: "drawing_id" });
Po.hasMany(PoList, { foreignKey: "po_id" });
PoList.belongsTo(Po, { foreignKey: "po_id" });
PoList.belongsTo(Product, { foreignKey: "product_id" });

PoList.sync({ alter: false }).then().catch();

module.exports = PoList;
