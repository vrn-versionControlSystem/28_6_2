const { Op } = require("sequelize");
const Calibration = require("../../../../../models/company.models/machine.models/calibration.model");
const Instrument = require("../../../../../models/company.models/Instrument.models/Instrument.model");
const globalError = require("../../../../../errors/global.error");

const getCalibration = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "" } = req.body;

    const { count, rows: calibration } = await Calibration.findAndCountAll({
      where: { deleted: false },
      include: [
        {
          model: Instrument,
          attributes: [
            "instrument_id",
            "instrument_name",
            "instrument_make",
            "instrument_no",
            "instrument_size",
            "instrument_lc",
            "instrument_cal_frq",
          ],
        },
      ],
      limit: +pageSize,
      offset: (+pageIndex - 1) * +pageSize,
    });
    if (count === 0) {
      return res.status(200).json({ sucess: true, total: 0, data: [] });
    }
    const data = calibration.map((calibration) => {
      const { deleted, ...otherData } = calibration.toJSON();
      return otherData;
    });
    return res.status(200).json({ sucess: true, total: count, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  getCalibration,
};
