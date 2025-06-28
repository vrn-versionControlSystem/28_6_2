const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const Machine = require("../machine.models/machine.model");

const BreakdownModel = sequelize.define(
  "Breakdown",
  {
    breakdown_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },

    breakdown_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    breakdown_time: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    machine_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    machine_problem: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action_taken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maintenance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cost: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    responsible_person: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spare_consumed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spare_cost: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complete_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complete_time: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    total_downtime: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },

    remarks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    machine_id: {
      type: DataTypes.UUID,
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
  },
  {
    timestamps: true,
    tableName: "breakdown",
  }
);
BreakdownModel.belongsTo(Machine, { foreignKey: "machine_id" });
BreakdownModel.sync({ alter: false }).then().catch();
module.exports = BreakdownModel;
