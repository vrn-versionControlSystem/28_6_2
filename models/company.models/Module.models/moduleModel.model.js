const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");

const Module = sequelize.define(
  "Module",
  {
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    translateKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Module", // Reference the same Module table
        key: "module_id",
      },
      onDelete: "CASCADE",
    },
    default: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
    tableName: "module",
  }
);

// Self-referencing associations
Module.hasMany(Module, { as: "subMenu", foreignKey: "parent_id" });
Module.belongsTo(Module, { as: "parent", foreignKey: "parent_id" });

Module.sync({ alter: false }).then().catch();

module.exports = Module;
