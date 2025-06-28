const globalError = require("../../../../../errors/global.error");
const User = require("../../../../../models/user.model");

const deleteUser = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    const value = {
      deleted: true,
    };
    const deleteUser = await User.update(value, {
      where: {
        user_id,
      },
    });
    if (deleteUser[0] == 0) {
      return next(globalError(400, "Something went wrong"));
    }
    return res
      .status(201)
      .json({ success: true, message: "User successfully Deleted" });
  } catch (error) {
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = { deleteUser };
