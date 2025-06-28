const { DataTypes } = require("sequelize");
// const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");
const { sequelize } = require("../configs/database");

const secretKey = process.env.SECRET_KEY || "0123456789abcdef0123456789abcdef";

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    type: {
      type: DataTypes.ENUM("super-admin", "admin", "sub-admin", "executive"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (
            !["super-admin", "admin", "sub-admin", "executive"].includes(value)
          ) {
            throw new Error("Invalid user type");
          }
        },
      },
      defaultValue: "sub-admin",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    added_by_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    added_by: {
      type: DataTypes.ENUM("super-admin", "admin"),
      allowNull: true,
      validate: {
        isInEnum(value) {
          if (!["super-admin", "admin"].includes(value)) {
            throw new Error("Invalid admins type");
          }
        },
      },
      defaultValue: "admin",
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
        fields: ["email"],
        where: {
          deleted: false,
        },
      },
      {
        unique: true,
        fields: ["user_id"],
      },
    ],
    tableName: "users",
  }
);

// User.beforeCreate(async (user) => {
//   const hashedPassword = await bcrypt.hash(user.password, 10);
//   return (user.password = hashedPassword);
// });

User.beforeCreate((user) => {
  user.password = CryptoJS.AES.encrypt(user.password, secretKey).toString();
});

User.sync({ alter: false }).then().catch();

module.exports = User;
