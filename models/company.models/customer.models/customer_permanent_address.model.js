const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const Customer = require("./customer.model");

const CustomerPermanentAddress = sequelize.define(
  "CustomerPermanentAddress",
  {
    address_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
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
        fields: ["address_id"],
      },
      {
        unique: true,
        fields: ["customer_id"],
      },
    ],
    tableName: "customer_permanent_addresses",
  }
);

Customer.hasOne(CustomerPermanentAddress, { foreignKey: "customer_id" });

CustomerPermanentAddress.sync({ alter: false }).then().catch();

module.exports = CustomerPermanentAddress;
