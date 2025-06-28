const { Op } = require("sequelize");
const Calibration = require("../../../../../models/company.models/machine.models/calibration.model");

const globalError = require("../../../../../errors/global.error");
const dayjs = require("dayjs");

const createCalibration = async (req, res, next) => {
  try {
    const {
      calibration_description,
      calibration_date,
      calibration_result,
      calibration_report_no,
      next_due_date,
      Instrument,
      certificate = "",
    } = req.body;

    const value = {
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
      calibration_result,
      calibration_report_no,
      next_due_date: dayjs(next_due_date).format("YYYY-MM-DD"),
      calibration_description,
      calibration_date: dayjs(calibration_date).format("YYYY-DD-MM"),
      certificate,
      instrument_id: Instrument?.instrument_id,
    };

    const calibration = await Calibration.create(value);

    if (!calibration) {
      return next(globalError(500, "Something went wrong"));
    }
    res.status(201).json({
      success: true,
      message: "Successfully Created",
      data: calibration.toJSON(),
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  createCalibration,
};
