const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const { sequelize } = require("../../../configs/database");
const InWardMaster = require("./inwardMaster.model");

const GRNMaster = sequelize.define(
  "GRNMaster",
  {
    grn_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    inward_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    grn_no: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    // status: {
    //   type: DataTypes.ENUM("pending", "delivered", "processing", "rejected"),
    //   allowNull: false,
    //   validate: {
    //     isInEnum(value) {
    //       if (
    //         !["pending", "delivered", "processing", "rejected"].includes(value)
    //       ) {
    //         throw new Error("Invalid po status");
    //       }
    //     },
    //   },
    //   defaultValue: "pending",
    // },
    grn_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: dayjs(Date.now()).format("YYYY-MM-DD"),
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
    tableName: "grn_master",
  }
);

GRNMaster.beforeCreate(async (po) => {
  const uniqueInward = await generateUniqueInward();
  return (po.grn_no = uniqueInward);
});

const generateUniqueInward = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const dayOfYear = Math.floor((today - new Date(year, 0, 0)) / 86400000);
  const random = Math.floor(Math.random() * 10000);
  const grn_no = `${year}${random}`;

  const isInwardExist = await InWardMaster.findOne({
    where: {
      grn_no,
    },
  });
  if (!isInwardExist) {
    return grn_no;
  }
  return generateUniqueInward();
};

GRNMaster.belongsTo(InWardMaster, { foreignKey: "inward_id" });

GRNMaster.sync({ alter: false }).then().catch();

module.exports = GRNMaster;
