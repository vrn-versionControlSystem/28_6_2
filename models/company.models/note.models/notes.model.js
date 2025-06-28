const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");

const Note = sequelize.define(
  "Note",
  {
    note_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
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
    tableName: "notes",
  }
);
// BreakdownModel.belongsTo(Machine, { foreignKey: "machine_id" });
Note.sync({ alter: false }).then().catch();
module.exports = Note;
