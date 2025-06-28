const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const { sequelize } = require("../../../configs/database");

const Enquiry = require("./enquiry");

const EnquiryList = sequelize.define(
  "EnquiryList",
  {
    enquiry_list_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    enquiry_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    hsn_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    drawing_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    material_grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    part_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    part_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    part_type: {
      type: DataTypes.ENUM(
        "CIRCLE",
        "RING",
        "SQUARE",
        "PROFILE DRAWING",
        "FABRICATION DRAWING",
        "MACHINE DRAWING"
      ),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (
            ![
              "CIRCLE",
              "RING",
              "SQUARE",
              "PROFILE DRAWING",
              "FABRICATION DRAWING",
              "MACHINERY",
            ].includes(value)
          ) {
            throw new Error("Invalid Part type");
          }
        },
      },
      defaultValue: "CIRCLE",
    },
    od: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    length: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    width: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thickness: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qap_attachment: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    drawing_attachment: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    indexes: [],
    tableName: "enquiry_list",
  }
);

EnquiryList.belongsTo(Enquiry, {
  foreignKey: "enquiry_id",
});

EnquiryList.sync({ alter: false }).then().catch();

module.exports = EnquiryList;
