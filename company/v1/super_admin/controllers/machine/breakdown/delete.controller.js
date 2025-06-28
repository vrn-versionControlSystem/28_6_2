const { Op } = require("sequelize");
const BreakDown = require("../../../../../../models/company.models/machine.models/breakdown.model");
const globalError = require("../../../../../../errors/global.error");

const deleteBreakdown = async (req, res, next) => {
  try {
    const { breakdown_id } = req.body;
    const deletedBreakdown = await BreakDown.update(
      { deleted: true },
      {
        where: {
          breakdown_id,
        },
      }
    );
    if (deletedBreakdown[0] === 0) {
      return res.status(400).json({ message: "Breakdown not deleted" });
    }
    res
      .status(200)
      .json({ message: "Breakdown deleted successfully", success: true });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  deleteBreakdown,
};
