const { sequelize } = require("../../../../../configs/database");
const globalError = require("../../../../../errors/global.error");
const Conditions = require("../../../../../models/company.models/note.models/condition.model");

const newConditionRegistration = async (req, res, next) => {
  try {
    const { name, condition, type = "po" } = req.body;
    const value = {
      name,
      condition,
      type,
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };
    const conditions = await Conditions.create(value);
    if (!conditions) {
      return next(globalError(500, "Something went wrong"));
    }

    return res.status(200).json({
      success: true,
      message: "Condition Added Successfully",
      data: { name, condition },
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { newConditionRegistration };
