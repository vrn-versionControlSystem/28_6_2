const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const User = require("../../user.model");
const Task = sequelize.define(
  "Task",
  {
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    task: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("high", "medium", "low"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["high", "medium", "low"].includes(value)) {
            throw new Error("Invalid Priority type");
          }
        },
      },
    },
    task_status: {
      type: DataTypes.ENUM("pending", "completed", "rejected", "invalid"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (
            !["pending", "completed", "rejected", "invalid"].includes(value)
          ) {
            throw new Error("Invalid Task Status type");
          }
        },
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "completed"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["active", "inactive"].includes(value)) {
            throw new Error("Invalid Status type");
          }
        },
      },
    },
    assigned_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    assigned_to: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: User,
        key: "user_id",
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
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
    tableName: "tasks",
  }
);
Task.belongsTo(User, { foreignKey: "assigned_by", as: "AssignedBy" });
Task.belongsTo(User, { foreignKey: "assigned_to", as: "AssignedTo" });
Task.sync({ alter: false }).then().catch();
module.exports = Task;
