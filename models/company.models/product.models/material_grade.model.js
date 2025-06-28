const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const Product = require("./product.model");

const MaterialGrade = sequelize.define(
  "MaterialGrade",
  {
    material_grade_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
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
        fields: ["material_grade_id"],
      },
    ],
    tableName: "material_grades",
  }
);

Product.belongsTo(MaterialGrade, { foreignKey: "material_grade_id" });

MaterialGrade.sync({ alter: false }).then().catch();

module.exports = MaterialGrade;
