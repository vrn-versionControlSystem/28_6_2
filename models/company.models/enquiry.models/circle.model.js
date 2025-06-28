const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const Enquiry = require("./enquiry");
const EnquiryList = require("./enquiryList.model");

const Circle = sequelize.define(
  "Circle",
  {
    circle_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    enquiry_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    enquiry_list_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    od: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    thickness: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    od_weight: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    row_material_rate: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    od_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    cutting_mtr: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    cutting_rate: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    cutting_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    profit: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    each_rate: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    circle_per_kg: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    qty: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
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
    tableName: "circle",
  }
);

Circle.belongsTo(Enquiry, { foreignKey: "enquiry_id" });
Circle.belongsTo(EnquiryList, { foreignKey: "enquiry_list_id" });

Circle.sync({ alter: false }).then().catch();

module.exports = Circle;
