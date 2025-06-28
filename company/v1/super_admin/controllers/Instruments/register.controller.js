const globalError = require("../../../../../errors/global.error");
const loggerError = require("../../../../../errors/logger.error");
const Instrument = require("../../../../../models/company.models/Instrument.models/Instrument.model");
const Logger = require("../../../../../models/logger.model");
const isKeyInObject = require("../../../../../utils/helpers/is_key_in_object");
const API_Prefix = require("../../../constants/constant");
const {
  trimSpace,
  toUpperCaseOrNull,
  toUpperCase,
} = require("../../../../../utils/helpers/text_checker");
const path = require("path");
const fs = require("fs");

const NewInstrument = async (req, res, next) => {
  try {
    const {
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
    } = req.body;
    const value = {
      instrument_name: toUpperCase(trimSpace(instrument_name)),
      instrument_make: toUpperCase(trimSpace(instrument_make)),
      instrument_no: toUpperCaseOrNull(trimSpace(instrument_no)),
      instrument_size,
      instrument_lc,
      instrument_cal_frq,
      instrument_freq_type,
      location,
      in_use,
      remark,
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };
    const newInstrument = await Instrument.create(value);
    if (!newInstrument) {
      return next(globalError(400, "Something went wrong"));
    }
    return res
      .status(201)
      .json({ success: true, message: "Instrument successfully created" });
  } catch (error) {
    if (error?.fields) {
      if (isKeyInObject(error?.fields, "Instrument_no")) {
        return next(globalError(409, "Instrument ID already exists"));
      }
    }
    await Logger.create(
      loggerError(
        "/create",
        "POST",
        error?.message,
        API_Prefix + "/instrument/register"
      )
    );
    return next(globalError(500, "Internal server error"));
  }
};

const uploadCertificateAttachment = async (req, res, next) => {
  try {
    const { filePath = "" } = req.body;

    if (filePath && !req.file) {
      let relativePath = filePath.split("uploads/")[1];
      const fileUrl = path.join(
        __dirname,
        "../../../../../uploads/",
        relativePath
      );

      fs.access(fileUrl, fs.constants.F_OK, (err) => {
        if (err) {
          return res
            .status(400)
            .json({ success: false, message: "File not found" });
        }

        fs.unlink(fileUrl, (err) => {
          if (err) {
            return next(globalError(500, "Error deleting file"));
          }

          return res.status(200).json({
            success: true,
            message: "File Deleted Successfully",
          });
        });
      });
    } else if (filePath && req.file) {
      let relativePath = filePath.split("uploads/")[1];
      const fileUrl = path.join(
        __dirname,
        "../../../../../uploads/",
        relativePath
      );

      fs.access(fileUrl, fs.constants.F_OK, (err) => {
        if (err) {
          return res
            .status(400)
            .json({ success: false, message: "Old file not found" });
        }

        fs.unlink(fileUrl, (err) => {
          if (err) {
            return next(globalError(500, "Error deleting old file"));
          }

          return res.status(200).json({
            success: true,
            message: "Old file deleted, new file uploaded successfully",
            path: req.file.path,
          });
        });
      });
    } else if (req.file) {
      return res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        path: req.file.path,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "No file path or file provided",
      });
    }
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { NewInstrument, uploadCertificateAttachment };
