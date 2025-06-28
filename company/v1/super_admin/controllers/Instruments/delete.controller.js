const globalError = require("../../../../../errors/global.error");
const Instrument = require("../../../../../models/company.models/Instrument.models/Instrument.model");
const API_Prefix = require("../../../constants/constant");
const Logger = require("../../../../../models/logger.model");
const loggerError = require("../../../../../errors/logger.error");

const deleteInstrument = async (req, res, next) => {
  try {
    const { instrument_id } = req.body;
    const value = {
      deleted: true,
    };
    const deleteInstrument = await Instrument.update(value, {
      where: {
        instrument_id,
      },
    });
    if (deleteInstrument[0] == 0) {
      return next(globalError(400, "Something went wrong"));
    }
    return res
      .status(200)
      .json({ success: true, message: "Instrument successfully Deleted" });
  } catch (error) {
    await Logger.create(
      loggerError(
        "/delete",
        "DELETE",
        error?.message,
        API_Prefix + "/instrument/delete"
      )
    );
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = { deleteInstrument };
