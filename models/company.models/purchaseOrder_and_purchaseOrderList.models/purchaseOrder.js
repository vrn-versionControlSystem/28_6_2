const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const { sequelize } = require("../../../configs/database");
const Customer = require("../customer.models/customer.model");

const PurchaseOrder = sequelize.define(
  "PurchaseOrder",
  {
    purchase_order_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    // poa: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    //     defaultValue: null
    // },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_remark: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "accepted",
        "received",
        "rejected",
        "processing"
      ),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (
            ![
              "pending",
              "accepted",
              "received",
              "rejected",
              "processing",
            ].includes(value)
          ) {
            throw new Error("Invalid po status");
          }
        },
      },
      defaultValue: "pending",
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: dayjs(Date.now()).format("YYYY-MM-DD"),
    },
    currency_type: {
      type: DataTypes.ENUM("USD", "INR"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["INR", "USD"].includes(value)) {
            throw new Error("Invalid po currency type");
          }
        },
      },
      defaultValue: "INR",
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
        fields: ["purchase_order_id"],
      },
      // {
      //     unique: true,
      //     fields: ["poa"]
      // },
    ],
    tableName: "purchaseorders",
  }
);

// Po.beforeCreate(async (po) => {
//     const uniquePOA = await generateUniquePOA()
//     return po.poa = uniquePOA;
// })

// const generateUniquePOA = async () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const dayOfYear = Math.floor((today - new Date(year, 0, 0)) / 86400000); // Calculating the day of the year
//     const random = Math.floor(Math.random() * 1000); // You can adjust this range as needed
//     const poa = `${year}${dayOfYear}${random}`;

//     const isPOAExist = await Po.findOne({
//         where: {
//             poa
//         }
//     })
//     if (!isPOAExist) {
//         return poa
//     }
//     return generateUniquePOA()
// }

// DispatchList.belongsTo(Po, { foreignKey: 'po_id' });

PurchaseOrder.belongsTo(Customer, { foreignKey: "customer_id" });

PurchaseOrder.sync({ alter: false }).then().catch();

module.exports = PurchaseOrder;
