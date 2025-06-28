const { sequelize } = require("../../../../../configs/database");
const globalError = require("../../../../../errors/global.error");
const Conditions = require("../../../../../models/company.models/note.models/condition.model");

const deleteCondition = async (req, res, next) => {
  try {
    const { condition_id } = req.body;
    const value = {
      deleted: true,
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
      message: "Condition Deleted",
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { deleteCondition };
