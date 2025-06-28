const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const { sequelize } = require("../../../configs/database");

const Product = require("../product.models/product.model");

const EnquiryList = sequelize.define(
  "EnquiryList",
  {
    enquiry_list_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    enquiry_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    drawing_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    delivery_date: {
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
    indexes: [],
    tableName: "enquiry_list",
  }
);
Product.hasMany(EnquiryList, { foreignKey: "product_id" });
EnquiryList.belongsTo(Product, { foreignKey: "product_id" });

EnquiryList.sync({ alter: false }).then().catch();

module.exports = EnquiryList;
