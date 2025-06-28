const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const Module = require("./moduleModel.model");
const User = require("../../user.model");

const ModuleDetail = sequelize.define(
  "ModuleDetail",
  {
    module_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    show_in_menu: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    is_allowed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: "module_details",
  }
);

// Self-referencing associations
Module.hasMany(ModuleDetail, { foreignKey: "module_id" });
ModuleDetail.belongsTo(Module, { foreignKey: "module_id" });
ModuleDetail.belongsTo(User, { foreignKey: "user_id" });

ModuleDetail.sync({ alter: false }).then().catch();

module.exports = ModuleDetail;
