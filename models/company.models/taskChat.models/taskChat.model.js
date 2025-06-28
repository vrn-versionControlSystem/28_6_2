const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");
const User = require("../../user.model");
const Task = require("../Task.models/task.model");
const TaskChat = sequelize.define(
  "TaskChat",
  {
    task__chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    receiver_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: "task_chats",
  }
);
TaskChat.belongsTo(User, { foreignKey: "sender_id", as: "Sender" });
TaskChat.belongsTo(User, { foreignKey: "receiver_id", as: "Receiver" });
TaskChat.belongsTo(Task, { foreignKey: "task_id" });
TaskChat.sync({ alter: false }).then().catch();
module.exports = TaskChat;
