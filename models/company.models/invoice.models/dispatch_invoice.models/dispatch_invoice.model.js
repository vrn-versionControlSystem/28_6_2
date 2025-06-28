const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");

const DispatchInvoice = sequelize.define(
  "DispatchInvoice",
  {
    dispatch_invoice_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    invoice_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cefa: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    coo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    invoice_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    invoice_type: {
      type: DataTypes.ENUM("domestic", "foreign"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["domestic", "foreign"].includes(value)) {
            throw new Error("Invalid Invoice type");
          }
        },
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancel"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["pending", "confirmed", "cancel"]],
          msg: "Invalid dispatch status",
        },
      },
      defaultValue: "pending",
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
        fields: ["dispatch_invoice_id"],
      },
      {
        unique: true,
        fields: ["invoice_no"],
      },
    ],
    tableName: "dispatch_invoice",
  }
);

// DispatchInvoice.beforeCreate(async (invoice) => {
//   const uniqueInvoiceNo = await generateUniqueInvoiceNo();
//   return (invoice.invoice_no = uniqueInvoiceNo);
// });

// const generateUniqueInvoiceNo = async () => {
//   const today = new Date();
//   const year = today.getFullYear();
//   let invoice_no = `BI${year}1`;

//   let isInvoiceNoExist = await DispatchInvoice.findOne({
//     where: {
//       invoice_no,
//     },
//   });

//   if (!isInvoiceNoExist) {
//     return invoice_no;
//   }

//   const highestInvoice = await DispatchInvoice.findOne({
//     attributes: [
//       [sequelize.fn("MAX", sequelize.col("invoice_no")), "maxInvoiceNo"],
//     ],
//   });
//   const maxInvoiceNo = highestInvoice.dataValues.maxInvoiceNo;

//   const lastCharacter = maxInvoiceNo.slice(-1);
//   const incrementedLastCharacter = String(Number(lastCharacter) + 1);
//   const newInvoiceNo = `BI${year}${incrementedLastCharacter}`;

//   return newInvoiceNo;
// };
DispatchInvoice.sync({ alter: false }).then().catch();

module.exports = DispatchInvoice;
