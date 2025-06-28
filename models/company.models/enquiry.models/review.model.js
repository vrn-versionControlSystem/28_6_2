const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");

const EnquiryList = require("./enquiryList.model");

const EnquiryReview = sequelize.define(
  "EnquiryReview",
  {
    enquiry_review_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    customer_requirement: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    enquiry_list_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    feasibility: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    customer_po_review: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "enquiry_review",
  }
);

EnquiryReview.belongsTo(EnquiryList, {
  foreignKey: "enquiry_list_id",
});

EnquiryReview.sync({ alter: false }).then().catch();

module.exports = EnquiryReview;
