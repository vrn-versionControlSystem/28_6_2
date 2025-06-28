const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const { sequelize } = require("../../../configs/database");
const Customer = require("../customer.models/customer.model");
const EnquiryList = require("./enquiryDetails.model");

const Enquiry = sequelize.define(
  "Enquiry",
  {
    enquiry_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    enq_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    enquiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    enquiry_type: {
      type: DataTypes.ENUM("DOMESTIC", "FOREIGN"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["DOMESTIC", "FOREIGN"].includes(value)) {
            throw new Error("Invalid Domestic type");
          }
        },
      },
      defaultValue: "DOMESTIC",
    },
    poc_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    poc_contact: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
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
    tableName: "enquiry_master",
  }
);

Enquiry.belongsTo(Customer, {
  foreignKey: "customer_id",
});
EnquiryList.belongsTo(Enquiry, { foreignKey: "enquiry_id" });
Enquiry.hasMany(EnquiryList, { foreignKey: "enquiry_id" });
Enquiry.sync({ alter: false }).then().catch();

module.exports = Enquiry;
