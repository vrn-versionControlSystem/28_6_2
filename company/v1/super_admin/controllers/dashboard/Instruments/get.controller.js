const { Op, fn, col } = require("sequelize");
const Calibration = require("../../../../../../models/company.models/machine.models/calibration.model");
const Instrument = require("../../../../../../models/company.models/Instrument.models/Instrument.model");
const globalError = require("../../../../../../errors/global.error");
const dayjs = require("dayjs");

const getCalibrationOneMonthLater = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "" } = req.body;

    const today = dayjs().startOf("day").toDate();
    const oneMonthLater = dayjs().add(1, "month").endOf("day").toDate();

    const { count, rows: calibration } = await Calibration.findAndCountAll({
      where: {
        deleted: false,
        next_due_date: {
          [Op.gte]: dayjs(today).format("YYYY-MM-DD"),
          [Op.lte]: dayjs(oneMonthLater).format("YYYY-MM-DD"),
        },
      },
      include: [
        {
          model: Instrument,
          where: { deleted: false },
          attributes: [
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
      return res.status(200).json({ success: true, total: 0, data: [] });
    }

    const data = calibration.map((calibration) => {
      const { deleted, ...otherData } = calibration.toJSON();
      return otherData;
    });

    return res.status(200).json({ success: true, total: count, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getTotalInstrument = async (req, res, next) => {
  try {
    const count = await Instrument.count({
      where: {
        deleted: false,
      },
    });

    req.totalInstrument = count;
    return next();
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getTotalOverDueCalibration = async (req, res, next) => {
  try {
    const count = await Calibration.count({
      where: {
        deleted: false,
        next_due_date: {
          [Op.gte]: dayjs().format("YYYY-MM-DD"),
        },
      },
    });

    req.totalOverDueCalibration = count;
    return next();
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const Recent10Calibration = async (req, res, next) => {
  try {
    const calibration = await Calibration.findAll({
      where: {
        deleted: false,
      },
      attributes: [
        "instrument_id",
        [fn("MAX", col("calibration_date")), "latest_calibration_date"],
      ],
      group: ["instrument_id"],
      include: [
        {
          model: Instrument,
          where: { deleted: false },
          attributes: [
            "instrument_name",
            "instrument_make",
            "instrument_no",
            "instrument_size",
            "instrument_lc",
            "instrument_cal_frq",
          ],
        },
      ],
      having: {
        latest_calibration_date: {
          [Op.lte]: dayjs().format("YYYY-MM-DD"),
        },
      },
      order: [["instrument_id", "ASC"]],
      limit: 10,
    });

    req.recentCalibration = calibration;
    return next();
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const totalCalibrations = async (req, res, next) => {
  try {
    const count = await Calibration.count({
      where: {
        deleted: false,
      },
    });

    req.totalCalibration = count;
    return next();
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getCalibrationPieChart = async (req, res, next) => {
  try {
    const today = dayjs().startOf("day").toDate();
    const oneMonthLater = dayjs().add(1, "month").endOf("day").toDate();

    //upcoming calibration
    const count1 = await Calibration.count({
      where: {
        deleted: false,
        next_due_date: {
          [Op.gte]: dayjs(today).format("YYYY-MM-DD"),
          [Op.lte]: dayjs(oneMonthLater).format("YYYY-MM-DD"),
        },
      },
    });

    //overDue Calibration use group by max next deu date
    const count2 = await Calibration.count({
      where: {
        deleted: false,
      },
      attributes: [
        "instrument_id",
        [fn("MAX", col("next_due_date")), "latest_due_date"],
      ],
      group: ["instrument_id"],
      having: {
        latest_due_date: {
          [Op.lt]: dayjs().format("YYYY-MM-DD"),
        },
      },
      order: [["instrument_id", "ASC"]],
    });

    //uptodate
    const count3 = await Calibration.count({
      where: {
        deleted: false,
      },
      attributes: [
        "instrument_id",
        [fn("MAX", col("calibration_date")), "latest_calibration_date"],
        [fn("MAX", col("next_due_date")), "latest_due_date"],
      ],
      group: ["instrument_id"],
      having: {
        latest_calibration_date: {
          [Op.lte]: dayjs().format("YYYY-MM-DD"),
        },
        latest_due_date: {
          [Op.gt]: dayjs().format("YYYY-MM-DD"),
        },
      },
      order: [["instrument_id", "ASC"]],
    });

    return res.status(201).json({
      success: true,
      data: {
        totalInstrument: req.totalInstrument,
        totalOverDue: req.totalOverDueCalibration,
        recentCalibration: req.recentCalibration,
        pieChartData: [count1, count2.length, count3.length],
        totalCalibrations: req.totalCalibration,
      },
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  getCalibrationOneMonthLater,
  getTotalInstrument,
  getTotalOverDueCalibration,
  Recent10Calibration,
  totalCalibrations,
  getCalibrationPieChart,
};
