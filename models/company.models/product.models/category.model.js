const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const Product = require("./product.model");

const Category = sequelize.define(
  "Category",
  {
    category_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
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
        fields: ["category_id"],
      },
    ],
    tableName: "categories",
  }
);

Product.belongsTo(Category, { foreignKey: "category_id" });

Category.sync({ alter: false }).then().catch();

module.exports = Category;
