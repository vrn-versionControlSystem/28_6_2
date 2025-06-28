const globalError = require("../../../../../errors/global.error");
const Instrument = require("../../../../../models/company.models/Instrument.models/Instrument.model");
const API_Prefix = require("../../../constants/constant");
const isKeyInObject = require("../../../../../utils/helpers/is_key_in_object");
const Logger = require("../../../../../models/logger.model");
const loggerError = require("../../../../../errors/logger.error");

const updateInstrument = async (req, res, next) => {
  try {
    const {
      instrument_name,
      instrument_make,
      instrument_no,
      instrument_size,
      instrument_lc,
      instrument_cal_frq,
      instrument_id,
      instrument_freq_type,
      location,
      in_use,
      remark,
    } = req.body;
    const value = {
      instrument_name,
      instrument_make,
      instrument_no,
      instrument_size,
      instrument_lc,
      instrument_cal_frq,
      instrument_freq_type,
      location,
      in_use,
      remark,
    };
    const updateInstrument = await Instrument.update(value, {
      where: {
        instrument_id,
      },
    });
    if (updateInstrument[0] == 0) {
      return next(globalError(400, "Something went wrong"));
    }
    return res
      .status(200)
      .json({ success: true, message: "Instrument successfully Updated" });
  } catch (error) {
    if (error?.fields) {
      if (isKeyInObject(error?.fields, "Instrument_no")) {
        return next(globalError(409, "Instrument ID already exists"));
      }
    }
    await Logger.create(
      loggerError(
        "/update",
        "PUT",
        error?.message,
        API_Prefix + "/instrument/update"
      )
    );
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = { updateInstrument };
