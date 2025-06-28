const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const Product = require("./product.model");

const Drawing = sequelize.define(
  "Drawing",
  {
    drawing_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    revision_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    raw_attachment_path: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue:null
    },
    finish_attachment_path: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue:null
    },
    process_attachment_path: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue:null
    },
    raw_weight: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    finish_weight: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    indexes: [
      {
        unique: true,
        fields: ["drawing_id"],
      },
    ],
    tableName: "drawings",
  }
);

Product.hasMany(Drawing, { foreignKey: "product_id" });
Drawing.sync({ alter: false }).then().catch();

module.exports = Drawing;
