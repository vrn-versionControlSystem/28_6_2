const globalError = require("../../../../../errors/global.error");
const User = require("../../../../../models/user.model");
const isKeyInObject = require("../../../../../utils/helpers/is_key_in_object");

const newUserRegistration = async (req, res, next) => {
  try {
    const { name, email, status, password, type, mobile } = req.body;
    console.log("req.body", req.body);

    const value = {
      name,
      email,
      status,
      password,
      type,
      mobile,
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };

    const newUser = await User.create(value);
    if (!newUser) {
      return next(globalError(400, "Something went wrong"));
    }

    return res
      .status(201)
      .json({ success: true, message: "User successfully created" });
  } catch (error) {
    if (error?.fields) {
      if (isKeyInObject(error?.fields, "users_email")) {
        return next(globalError(409, "Email is already exists"));
      }
    }

    return next(globalError(500, "Internal server error"));
  }
};

module.exports = { newUserRegistration };
