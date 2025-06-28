const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");
const DispatchInvoice = require("./dispatch_invoice.model");

const DispatchNote = sequelize.define(
  "DispatchNote",
  {
    dispatch_note_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    dispatch_invoice_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    condition_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    condition: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["dispatch_note_id"],
      },
    ],
    tableName: "dispatch_note",
  }
);

DispatchInvoice.hasOne(DispatchNote, { foreignKey: "dispatch_invoice_id" });

DispatchNote.sync({ alter: false }).then().catch();

module.exports = DispatchNote;
