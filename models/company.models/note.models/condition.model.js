const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");

const Conditions = sequelize.define(
  "Conditions",
  {
    condition_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    condition: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("foreign", "domestic", "po", "purchase_order"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (
            !["foreign", "domestic", "po", "purchase_order"].includes(value)
          ) {
            throw new Error("Invalid type");
          }
        },
      },
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    added_by_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    added_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "invoice_conditions",
  }
);
// BreakdownModel.belongsTo(Machine, { foreignKey: "machine_id" });
Conditions.sync({ alter: false }).then().catch();
module.exports = Conditions;
