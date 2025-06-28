const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const { sequelize } = require("../../../configs/database");
const GRNMaster = require("./grnMaster.model");
const Product = require("../product.models/product.model");

const GRNDetail = sequelize.define(
  "GRNDetail",
  {
    grn_detail_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    grn_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    ordered_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    inward_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accepted_quantity: {
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
    tableName: "grn_details",
  }
);
GRNDetail.hasMany(GRNMaster, { foreignKey: "grn_id" });
GRNDetail.belongsTo(GRNMaster, { foreignKey: "grn_id" });
GRNDetail.belongsTo(Product, { foreignKey: "product_id" });

GRNDetail.sync({ alter: false }).then().catch();

module.exports = GRNDetail;
