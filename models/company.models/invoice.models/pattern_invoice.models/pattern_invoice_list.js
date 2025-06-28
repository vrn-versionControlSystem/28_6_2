// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../../../../configs/database");

// const Product = require("../../product.models/product.model");
// const PatternInvoice = require("./pattern_invoice");
// const Po = require("../../po_and_poList.models/po.model");
// const PoList = require("../../po_and_poList.models/po_list.model");

// const PatternInvoiceList = sequelize.define(
//   "PatternInvoiceList",
//   {
//     pattern_invoice_list_id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV1,
//       allowNull: false,
//       primaryKey: true,
//     },
//     pattern_invoice_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//     },
//     item_quantity: {
//       type: DataTypes.DOUBLE,
//       allowNull: true,
//       defaultValue: 0,
//     },
//     po_id: {
//       type: DataTypes.UUID,
//       allowNull: true,
//     },
//     po_list_id: {
//       type: DataTypes.UUID,
//       allowNull: true,
//     },
//     project_no: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       defaultValue: null,
//     },
//     serial_number: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       comment: "po serial number",
//     },
//     rate: {
//       type: DataTypes.DOUBLE,
//       allowNull: false,
//     },
//     no: {
//       type: DataTypes.DOUBLE,
//       allowNull: false,
//     },
//     number: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       comment: "po number",
//     },
//     product_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//     },
//     item_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     item_code: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       defaultValue: null,
//     },
//     pump_model: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       defaultValue: null,
//     },
//     unit_measurement: {
//       type: DataTypes.ENUM("no"),
//       validate: {
//         isInEnum(value) {
//           if (!["no"].includes(value)) {
//             throw new Error("Invalid product unit measurement");
//           }
//         },
//       },
//       defaultValue: "no",
//     },
//     hsn_code: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       defaultValue: null,
//     },
//   },
//   {
//     timestamps: true,
//     indexes: [
//       {
//         unique: true,
//         fields: ["pattern_invoice_list_id"],
//       },
//     ],
//     tableName: "pattern_invoice_lists",
//   }
// );

// PatternInvoiceList.belongsTo(Product, { foreignKey: "product_id" });
// PatternInvoiceList.belongsTo(Po, { foreignKey: "po_id" });
// PatternInvoiceList.belongsTo(PoList, { foreignKey: "po_list_id" });
// PatternInvoiceList.sync({ alter: false }).then().catch();

// module.exports = PatternInvoiceList;
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");

const Product = require("../../product.models/product.model");
const PatternInvoice = require("./pattern_invoice");
const Po = require("../../po_and_poList.models/po.model");
const PoList = require("../../po_and_poList.models/po_list.model");

const PatternInvoiceList = sequelize.define(
  "PatternInvoiceList",
  {
    pattern_invoice_list_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    pattern_invoice_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    item_quantity: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    po_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    po_list_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    project_no: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    serial_number: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "po serial number",
    },
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    no: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "po number",
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    pump_model: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    unit_measurement: {
      type: DataTypes.ENUM("no", "mm", "kg"),
      validate: {
        isInEnum(value) {
          if (!["no", "mm", "kg"].includes(value)) {
            throw new Error("Invalid product unit measurement");
          }
        },
      },
      defaultValue: "no",
    },
    hsn_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    // Adding the new 'remark' column
    remark: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      comment: "Additional remarks or notes",
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["pattern_invoice_list_id"],
      },
    ],
    tableName: "pattern_invoice_lists",
  }
);

PatternInvoice.hasMany(PatternInvoiceList, {
  foreignKey: "pattern_invoice_id",
});

PatternInvoiceList.belongsTo(Product, { foreignKey: "product_id" });
PatternInvoiceList.belongsTo(Po, { foreignKey: "po_id" });
PatternInvoiceList.belongsTo(PoList, { foreignKey: "po_list_id" });

// Sync the table and update the schema
PatternInvoiceList.sync({ alter: true })
  // .then(() => console.log("PatternInvoiceList table updated successfully"))
  .catch((err) =>
    console.error("Error updating PatternInvoiceList table:", err)
  );

module.exports = PatternInvoiceList;
