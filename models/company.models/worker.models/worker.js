const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");

const Worker = sequelize.define(
  "Worker",
  {
    worker_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    worker_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    worker_mobile: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    worker_adhaar: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    worker_pan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    worker_image: {
      type: DataTypes.TEXT("medium"),
      // defaultValue: "",
    },
    worker_dob: {
      type: DataTypes.TEXT,
      defaultValue: false,
    },
    worker_blood_group: {
      type: DataTypes.TEXT,
      defaultValue: false,
    },
    worker_address: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        if (value === "" || value === null) {
          this.setDataValue("worker_address", null);
        } else this.setDataValue("worker_address", value);
      },
    },

    worker_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    worker_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    indexes: [],
    tableName: "workers",
  }
);

Worker.sync({ alter: false })
  .then(() => {})
  .catch((error) => {});

module.exports = Worker;
