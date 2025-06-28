const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../configs/database");
const DispatchInvoice = require("./dispatch_invoice.model");

const DispatchBoxList = sequelize.define(
  "DispatchBoxList",
  {
    dispatch_box_list_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    dispatch_invoice_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    box_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    box_length: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    box_height: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    box_breadth: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    box_size_type: {
      type: DataTypes.ENUM("mm", "cm", "inch", "m"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["mm", "cm", "inch", "m"].includes(value)) {
            throw new Error("Invalid box size type");
          }
        },
      },
      defaultValue: "inch",
    },
    tare_weight: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["dispatch_box_list_id"],
      },
    ],
    tableName: "dispatch_box_lists",
  }
);

DispatchInvoice.hasMany(DispatchBoxList, { foreignKey: "dispatch_invoice_id" });

DispatchBoxList.sync({ alter: false }).then().catch();

module.exports = DispatchBoxList;
