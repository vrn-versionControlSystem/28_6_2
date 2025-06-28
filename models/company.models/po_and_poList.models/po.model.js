const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const { sequelize } = require("../../../configs/database");
const Customer = require("../customer.models/customer.model");
const Conditions = require("../note.models/condition.model");
const Note = require("../note.models/notes.model");
const DispatchList = require("../invoice.models/dispatch_invoice.models/dispatch_list.model");
const DispatchInvoice = require("../invoice.models/dispatch_invoice.models/dispatch_invoice.model");
const { Op } = require("sequelize");
const Po = sequelize.define(
  "Po",
  {
    po_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    poa: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    condition_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    note_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM("pending", "delivered", "processing", "rejected"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (
            !["pending", "delivered", "processing", "rejected"].includes(value)
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
        fields: ["po_id"],
      },
      {
        unique: true,
        fields: ["poa"],
      },
    ],
    tableName: "pos",
  }
);

Po.beforeCreate(async (po) => {
  const uniquePOA = await generateUniquePOA();
  return (po.poa = uniquePOA);
});

let poCounter = 1;

// const generateUniquePOA = async () => {
//   const today = new Date();
//   const year = today.getFullYear();
//   // const dayOfYear = Math.floor((today - new Date(year, 0, 0)) / 86400000); // Calculating the day of the year
//   // const random = Math.floor(Math.random() * 10000);
//   // const poa = `${year}${random}`;
//   const numDigits = Math.max(4, String(poCounter).length);
//   const counterStr = String(poCounter).padStart(numDigits, "0");
//   const poa = `${year}${counterStr}`;
//   const isPOAExist = await Po.findOne({
//     where: {
//       poa,
//     },
//     order: [["poa", "DESC"]],
//   });
//   if (!isPOAExist) {
//     poCounter += 1;
//     return poa;
//   } else {
//     poCounter += 1;
//     return generateUniquePOA();
//   }
// };

// const generateUniquePOA = async () => {
//   const today = new Date();
//   const year = today.getFullYear();

//   const existingPOAs = await Po.findAll({
//     where: {
//       poa: {
//         [Op.like]: `${year}%`,
//       },
//     },
//     attributes: ["poa"],
//     order: [["poa", "ASC"]],
//   });

//   let poCounter = 1;

//   if (existingPOAs.length > 0) {
//     const existingNumbers = existingPOAs.map((po) =>
//       parseInt(po.poa.slice(4), 10)
//     );

//     for (let i = 1; i <= existingNumbers.length + 1; i++) {
//       if (!existingNumbers.includes(i)) {
//         poCounter = i;
//         break;
//       }
//     }
//   }
//   const numDigits = Math.max(4, String(poCounter).length);
//   const counterStr = String(poCounter).padStart(numDigits, "0");
//   const poa = `${year}${counterStr}`;

//   console.log("Generated POA:", poa);

//   const isPOAExist = await Po.findOne({ where: { poa } });

//   if (isPOAExist) {
//     console.log("POA exists, retrying...");
//     return generateUniquePOA();
//   }

//   return poa;
// };

const generateUniquePOA = async () => {
  const today = new Date();
  const year = String(today.getFullYear()).slice(2); //Last two digit of the year
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(today.getDate()).padStart(2, "0");

  const datePart = `${year}${month}${day}`;

  const existingPOAs = await Po.findAll({
    where: {
      poa: {
        [Op.like]: `${datePart}%`,
      },
    },
    attributes: ["poa"],
    order: [["poa", "DESC"]],
  });

  let poCounter = 1;

  if (existingPOAs.length > 0) {
    const lastPOA = existingPOAs[0].poa;
    const lastCounter = parseInt(lastPOA.slice(-2), 10);
    poCounter = lastCounter + 1;
  }

  const counterStr = String(poCounter).padStart(2, "0");

  const poa = `${datePart}${counterStr}`;

  const isPOAExist = await Po.findOne({ where: { poa } });

  if (isPOAExist) {
    console.log("POA exists, retrying...");
    return generateUniquePOA();
  }

  return poa;
};

DispatchList.belongsTo(Po, { foreignKey: "po_id" });

Po.belongsTo(Customer, { foreignKey: "customer_id" });
Po.belongsTo(Conditions, { foreignKey: "condition_id" });
Po.belongsTo(Note, { foreignKey: "note_id" });

// Po.belongsTo(DispatchInvoice, { foreignKey: "dispatch_invoice_id" });

Po.sync({ alter: false }).then().catch();

module.exports = Po;
