const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");

const Customer = sequelize.define(
  "Customer",
  {
    customer_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    customer_code: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
      // defaultValue: null,
    },
    vender_code: {
      type: DataTypes.STRING,
      allowNull: true,
      // unique: true,
      // defaultValue: null,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    pan: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    gst_no: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    type: {
      type: DataTypes.ENUM("customer", "supplier", "both"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["customer", "supplier", "both"].includes(value)) {
            throw new Error("Invalid customer type");
          }
        },
      },
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
        fields: ["customer_id"],
      },
    ],
    tableName: "customers",
  }
);

// Customer.beforeCreate(async (customer) => {
//   const customerCode = await generateUniqueCustomerCode(customer.name[0]);
//   return (customer.customer_code = customerCode);
// });

// const generateUniqueCustomerCode = async (user) => {
//     const customerCode = `${user.toString().toUpperCase()}${Math.floor(
//         Math.random() * 10000,
//     )}`;

//     // Check if the customer code already exists
//     const customerWithSameCustomerCode = await Customer.findOne({
//         where: {
//             customer_code: customerCode
//         },
//     });

//     // If the customer code already exists, recursively call the function to generate a new one
//     if (customerWithSameCustomerCode) {
//         return generateUniqueCustomerCode(user, company_id);
//     }
//     return customerCode;
// };

Customer.sync({ alter: false }).then().catch();

module.exports = Customer;
