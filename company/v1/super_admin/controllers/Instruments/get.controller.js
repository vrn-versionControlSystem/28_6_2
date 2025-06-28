const { Op } = require("sequelize");
const Instrument = require("../../../../../models/company.models/Instrument.models/Instrument.model");
const globalError = require("../../../../../errors/global.error");
const API_Prefix = require("../../../constants/constant");
const Logger = require("../../../../../models/logger.model");
const loggerError = require("../../../../../errors/logger.error");

const getInstruments = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "" } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    if (query) {
      condition[Op.and].push({
        [Op.or]: [
          {
            instrument_name: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            instrument_size: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            instrument_make: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      });
    }

    const instruments = await Instrument.findAndCountAll({
      where: { ...condition },
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      attributes: [
        "instrument_id",
        "instrument_name",
        "instrument_make",
        "instrument_no",
        "instrument_size",
        "instrument_lc",
        "instrument_cal_frq",
        "instrument_freq_type",
        "location",
        "in_use",
        "remark",
        "createdAt",
      ],
    });
    return res.status(200).json({
      success: true,
      total: instruments.count,
      data: instruments.rows,
    });
  } catch (error) {
    await Logger.create(
      loggerError("/get", "POST", error?.message, API_Prefix + "/instrument")
    );
    next(globalError(500, "Internal server error"));
  }
};

const getAllInstruments = async (req, res, next) => {
  try {
    const instruments = await Instrument.findAll({
      where: {
        deleted: false,
      },
      attributes: [
        "instrument_id",
        "instrument_name",
        "instrument_make",
        "instrument_no",
        "instrument_size",
        "instrument_lc",
        "instrument_cal_frq",
        "instrument_freq_type",
        "location",
        "in_use",
        "remark",
        "createdAt",
      ],
    });
    return res.status(200).json({
      success: true,
      data: instruments,
    });
  } catch (error) {
    await Logger.create(
      loggerError("/get", "GET", error?.message, API_Prefix + "/instrument/all")
    );
    next(globalError(500, "Internal server error"));
  }
};

module.exports = { getInstruments, getAllInstruments };
