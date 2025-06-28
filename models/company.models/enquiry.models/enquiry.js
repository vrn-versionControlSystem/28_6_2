const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
const { sequelize } = require("../../../configs/database");

const Enquiry = sequelize.define(
  "Enquiry",
  {
    enquiry_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    enq: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    customer_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rfq_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enquiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    domestic_export: {
      type: DataTypes.ENUM("DOMESTIC", "FOREIGN"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["DOMESTIC", "FOREIGN"].includes(value)) {
            throw new Error("Invalid Domestic type");
          }
        },
      },
      defaultValue: "DOMESTIC",
    },
    enq_ref: {
      type: DataTypes.ENUM("MAIL", "WHATSAPP", "HAND"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["MAIL", "WHATSAPP", "HAND"].includes(value)) {
            throw new Error("Invalid Reference type");
          }
        },
      },
      defaultValue: "MAIL",
    },
    buyer_mail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    buyer_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    buyer_mobile: {
      type: DataTypes.TEXT,
      allowNull: true,
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
        fields: ["enq"],
      },
    ],
    tableName: "enquiry",
  }
);

Enquiry.beforeCreate(async (enquiry) => {
  const uniqueEnquiry = await generateUniqueEnquiry();
  return (enquiry.enq = uniqueEnquiry);
});

const generateUniqueEnquiry = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const dayOfYear = Math.floor((today - new Date(year, 0, 0)) / 86400000);
  const random = Math.floor(Math.random() * 1000);
  const enq = `${year}${dayOfYear}${random}`;

  const isEnquiryIdExist = await Enquiry.findOne({
    where: {
      enq,
    },
  });
  if (!isEnquiryIdExist) {
    return enq;
  }
  return generateUniqueEnquiry();
};

Enquiry.sync({ alter: false }).then().catch();

module.exports = Enquiry;
