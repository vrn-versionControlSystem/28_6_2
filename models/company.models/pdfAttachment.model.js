const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configs/database");

const PdfAttachment = sequelize.define(
  "PdfAttachment",
  {
    pdf_attachment_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    field_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    original_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mime_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    content: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },

    added_by_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    added_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["pdf_attachment_id"],
      },
    ],
    tableName: "pdf_attachments",
  }
);

PdfAttachment.sync({ alter: false }).then().catch();

module.exports = PdfAttachment;
