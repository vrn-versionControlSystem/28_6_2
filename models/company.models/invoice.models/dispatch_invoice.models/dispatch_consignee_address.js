const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");
const DispatchConsignee = require("./dispatch_consignee");

const DispatchConsigneeAddress = sequelize.define(
  "DispatchConsigneeAddress",
  {
    dispatch_address_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    dispatch_consignee_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    address_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zip_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state_code: {
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
        fields: ["dispatch_address_id"],
      },
    ],
    tableName: "dispatch_consignee_addresses",
  }
);

DispatchConsignee.hasOne(DispatchConsigneeAddress, {
  foreignKey: "dispatch_consignee_id",
});

DispatchConsigneeAddress.sync({ alter: false }).then().catch();

module.exports = DispatchConsigneeAddress;
