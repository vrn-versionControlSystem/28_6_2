const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const Customer = require("./customer.model");

const CustomerShippingDetails = sequelize.define(
  "CustomerShippingDetails",
  {
    shipping_details_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    pre_carriage_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    place_of_receipt: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    port_of_discharge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country_of_goods: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    port_of_loading: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    final_destination: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["shipping_details_id"],
      },
    ],
    tableName: "customer_shipping_details",
  }
);

Customer.hasMany(CustomerShippingDetails, { foreignKey: "customer_id" });

CustomerShippingDetails.sync({ alter: false }).then().catch();

module.exports = CustomerShippingDetails;
