const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const Instrument = require("../Instrument.models/Instrument.model");

const Calibration = sequelize.define(
  "Calibration",
  {
    calibration_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    instrument_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    calibration_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    calibration_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    calibration_result: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    calibration_report_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certificate: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    next_due_date: {
      type: DataTypes.DATE,
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
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "calibrations",
  }
);

Calibration.belongsTo(Instrument, { foreignKey: "instrument_id" });

Calibration.sync({ alter: false }).then().catch();
module.exports = Calibration;
