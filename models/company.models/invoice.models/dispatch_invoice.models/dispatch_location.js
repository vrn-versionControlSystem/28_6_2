const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");
const DispatchInvoice = require("./dispatch_invoice.model");

const DispatchLocation = sequelize.define(
  "DispatchLocation",
  {
    dispatch_location_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    dispatch_invoice_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    location_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["dispatch_location_id"],
      },
    ],
    tableName: "dispatch_locations",
  }
);

DispatchInvoice.hasMany(DispatchLocation, {
  foreignKey: "dispatch_invoice_id",
});

DispatchLocation.sync({ alter: false }).then().catch();

module.exports = DispatchLocation;
