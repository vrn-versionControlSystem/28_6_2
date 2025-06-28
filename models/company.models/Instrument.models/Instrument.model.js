const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");

const Instruments = sequelize.define(
  "Instruments",
  {
    instrument_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    instrument_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instrument_make: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instrument_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instrument_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instrument_lc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instrument_cal_frq: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    instrument_freq_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    in_use: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
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
    indexes: [
      {
        unique: true,
        fields: ["instrument_no"],
        where: {
          deleted: false,
        },
      },
    ],
    tableName: "instrument",
  }
);

Instruments.sync({ alter: false }).then().catch();
module.exports = Instruments;
