const { Op } = require("sequelize");
const Calibration = require("../../../../../models/company.models/machine.models/calibration.model");
const globalError = require("../../../../../errors/global.error");

const deleteCalibration = async (req, res, next) => {
  try {
    const { calibration_id } = req.body;
    const deletedCalibration = await Calibration.update(
      { deleted: true },
      {
        where: {
          calibration_id,
        },
      }
    );
    if (deletedCalibration[0] === 0) {
      return res.status(400).json({ message: "Calibration not deleted" });
    }
    res
      .status(200)
      .json({ message: "Calibration deleted successfully", success: true });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  deleteCalibration,
};
