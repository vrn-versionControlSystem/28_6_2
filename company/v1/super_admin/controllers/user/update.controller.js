const globalError = require("../../../../../errors/global.error");
const User = require("../../../../../models/user.model");
// const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");
const isKeyInObject = require("../../../../../utils/helpers/is_key_in_object");

const secretKey = process.env.SECRET_KEY || "0123456789abcdef0123456789abcdef";

const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, secretKey).toString();
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email, status, type, mobile } = req.body;
    const value = {
      name,
      email,
      status,
      type,
      mobile,
    };
    const updateUser = await User.update(value, {
      where: {
        user_id: req.body.user_id,
      },
    });
    if (updateUser[0] == 0) {
      return next(globalError(400, "Something went wrong"));
    }
    return res
      .status(201)
      .json({ success: true, message: "User successfully updated" });
  } catch (error) {
    if (error?.fields) {
      if (isKeyInObject(error?.fields, "users_email")) {
        return next(globalError(409, "Email is already exists"));
      }
    }
    return next(globalError(500, "Internal server error"));
  }
};

const updateUserPassword = async (req, res, next) => {
  try {
    const { password, user_id = "" } = req.body;
    // const hashPassword = await bcrypt.hash(password, 10);
    const encryptedPassword = encryptPassword(password);
    const value = { password: encryptedPassword };
    // const value = {
    //   password: hashPassword,
    // };
    const updateUserPassword = await User.update(value, {
      where: {
        user_id: user_id || req.jwtTokenDecryptData.user["user_id"],
      },
    });
    if (updateUserPassword[0] == 0) {
      return next(globalError(400, "Something went wrong"));
    }
    return res
      .status(201)
      .json({ success: true, message: "Password successfully updated" });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { updateUser, updateUserPassword };
