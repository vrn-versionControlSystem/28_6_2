const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");

const Machine = sequelize.define(
  "Machine",
  {
    machine_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    machine_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    machine_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    machine_model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    machine_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    added_by_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    added_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "machines",
  }
);

Machine.sync({ alter: false }).then().catch();
module.exports = Machine;
