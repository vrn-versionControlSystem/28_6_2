const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const PurchaseOrder = require("./purchaseOrder");
const Product = require("../product.models/product.model");
const dayjs = require("dayjs");

const PurchaseOrderList = sequelize.define(
  "PurchaseOrderList",
  {
    purchase_order_list_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    purchase_order_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    gst_type: {
      type: DataTypes.ENUM("GST", "NGST"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["GST", "NGST"].includes(value)) {
            throw new Error("Invalid GST Type");
          }
        },
      },
      defaultValue: "NGST",
    },
    gst: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    received_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    delivery_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: dayjs(Date.now()).format("YYYY-MM-DD"),
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    list_status: {
      type: DataTypes.ENUM(
        "pending",
        "rejected",
        "accepted",
        "received",
        "partially_received"
      ),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (
            ![
              "pending",
              "rejected",
              "accepted",
              "received",
              "partially_received",
            ].includes(value)
          ) {
            throw new Error("Invalid po list status");
          }
        },
      },
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["purchase_order_list_id"],
      },
    ],
    tableName: "purchase_order_list",
  }
);

PurchaseOrder.hasMany(PurchaseOrderList, { foreignKey: "purchase_order_id" });
PurchaseOrderList.belongsTo(PurchaseOrder, { foreignKey: "purchase_order_id" });
PurchaseOrderList.belongsTo(Product, { foreignKey: "product_id" });

PurchaseOrderList.sync({ alter: false }).then().catch();

module.exports = PurchaseOrderList;
