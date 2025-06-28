const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");
const PatternInvoiceList = require("./pattern_invoice_list");

const PatternInvoice = sequelize.define(
  "PatternInvoice",
  {
    pattern_invoice_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    invoice_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    invoice_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    invoice_type: {
      type: DataTypes.ENUM("pattern"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["pattern"].includes(value)) {
            throw new Error("Invalid Invoice type");
          }
        },
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancel"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["pending", "confirmed", "cancel"].includes(value)) {
            throw new Error("Invalid dispatch status");
          }
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
        fields: ["pattern_invoice_id"],
      },
      {
        unique: true,
        fields: ["invoice_no"],
      },
    ],
    tableName: "pattern_invoice",
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
// PatternInvoice.hasMany(PatternInvoiceList, {
//   foreignKey: "pattern_invoice_id",
// });
// PatternInvoiceList.belongsTo(PatternInvoice, {
//   foreignKey: "pattern_invoice_id",
// });

PatternInvoice.sync({ alter: false }).then().catch();

module.exports = PatternInvoice;
