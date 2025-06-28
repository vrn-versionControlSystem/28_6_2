const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const { sequelize } = require("../../../configs/database");
const InWardMaster = require("./inwardMaster.model");
const Product = require("../product.models/product.model");
const PurchaseOrderList = require("../purchaseOrder_and_purchaseOrderList.models/PurchaseOrderList");

const InWardDetail = sequelize.define(
  "InWardDetail",
  {
    inward_detail_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    inward_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    purchase_order_list_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    ordered_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    actual_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rejected_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    material_tc: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    inward_inspection: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    invoice: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    heat_treatment: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
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
    tableName: "inward_details",
  }
);
InWardMaster.hasMany(InWardDetail, { foreignKey: "inward_id" });
InWardDetail.belongsTo(InWardMaster, { foreignKey: "inward_id" });
InWardDetail.belongsTo(Product, { foreignKey: "product_id" });
InWardDetail.belongsTo(PurchaseOrderList, {
  foreignKey: "purchase_order_list_id",
});

InWardDetail.sync({ alter: false }).then().catch();

module.exports = InWardDetail;
