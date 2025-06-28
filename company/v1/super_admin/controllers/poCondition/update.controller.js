const { sequelize } = require("../../../../../configs/database");
const globalError = require("../../../../../errors/global.error");
const Conditions = require("../../../../../models/company.models/note.models/condition.model");

const updateCondition = async (req, res, next) => {
  try {
    const { name, condition, condition_id } = req.body;
    const value = {
      name,
      condition,
    };
    const conditions = await Conditions.update(value, {
      where: {
        condition_id,
      },
    });
    if (!conditions) {
      return next(globalError(500, "Something went wrong"));
    }

    return res.status(200).json({
      success: true,
      message: "Condition Added Updated",
      data: { name, condition },
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { updateCondition };
