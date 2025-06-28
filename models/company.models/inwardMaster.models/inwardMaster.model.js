const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const { sequelize } = require("../../../configs/database");
const Customer = require("../customer.models/customer.model");
const PurchaseOrder = require("../purchaseOrder_and_purchaseOrderList.models/purchaseOrder");

const InWardMaster = sequelize.define(
  "InWardMaster",
  {
    inward_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    purchase_order_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    inward_no: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    bill_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bill_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    challan_no: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    challan_date: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    // status: {
    //   type: DataTypes.ENUM("pending", "delivered", "processing", "rejected"),
    //   allowNull: false,
    //   validate: {
    //     isInEnum(value) {
    //       if (
    //         !["pending", "delivered", "processing", "rejected"].includes(value)
    //       ) {
    //         throw new Error("Invalid po status");
    //       }
    //     },
    //   },
    //   defaultValue: "pending",
    // },
    inward_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: dayjs(Date.now()).format("YYYY-MM-DD"),
    },
    added_by_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    added_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "inward_master",
  }
);

InWardMaster.belongsTo(PurchaseOrder, { foreignKey: "purchase_order_id" });

InWardMaster.belongsTo(Customer, { foreignKey: "customer_id" });

InWardMaster.sync({ alter: false }).then().catch();

module.exports = InWardMaster;
