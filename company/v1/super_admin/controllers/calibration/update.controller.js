const { Op } = require("sequelize");
const Calibration = require("../../../../../models/company.models/machine.models/calibration.model");
const globalError = require("../../../../../errors/global.error");
const dayjs = require("dayjs");

const updateCalibration = async (req, res, next) => {
  try {
    const { calibration_id } = req.body;
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
      calibration_result,
      calibration_report_no,
      next_due_date: dayjs(next_due_date).format("YYYY-MM-DD"),
      calibration_description,
      calibration_date: dayjs(calibration_date).format("YYYY-DD-MM"),
      certificate,
      instrument_id: Instrument?.instrument_id,
    };
    const calibration = await Calibration.update(value, {
      where: {
        calibration_id: calibration_id,
      },
    });
    if (calibration[0] === 0) {
      return next(globalError(400, "something went wrong"));
    }
    return res.status(200).json({
      sucess: true,
      message: "successfully updated",
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  updateCalibration,
};
