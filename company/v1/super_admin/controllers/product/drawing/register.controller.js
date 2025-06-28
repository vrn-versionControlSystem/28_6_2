const globalError = require("../../../../../../errors/global.error");
const Drawing = require("../../../../../../models/company.models/product.models/drawing.model");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../../utils/helpers/text_checker");
const { sequelize } = require("../../../../../../configs/database");

const newDrawingRegistration = async (req, res, next) => {
  console.log("req", req.jwtTokenDecryptData.authority[0]);
  console.log("req USER", req.jwtTokenDecryptData.user["user_id"]);
  console.log("req USER", req.jwtTokenDecryptData);

  try {
    const { revision_number, raw_weight, finish_weight, product_id } = req.body;
    const {
      raw_attachment = [],
      process_attachment = [],
      finish_attachment = [],
    } = req.files;
    const value = {
      revision_number: trimSpace(revision_number),
      raw_weight,
      finish_weight,
      raw_attachment_path:
        raw_attachment.length > 0 ? raw_attachment[0].path : null,
      finish_attachment_path:
        finish_attachment.length > 0 ? finish_attachment[0].path : null,
      process_attachment_path:
        process_attachment.length > 0 ? process_attachment[0].path : null,
      product_id,
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };
    const drawing = await Drawing.create(value);
    if (!drawing) {
      return next(globalError(500, "Something went wrong"));
    }
    return res
      .status(200)
      .json({ success: true, message: "Drawing successfully created" });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const newDrawingRegistrationapi = async (req, res, next) => {
  try {
    const { revision_number, raw_weight, finish_weight, product_id } = req.body;
    console.log("req.body", req.body);
    const {
      raw_attachment = [],
      process_attachment = [],
      finish_attachment = [],
    } = req.files;
    const value = {
      revision_number,
      raw_weight,
      finish_weight,
      raw_attachment_path:
        raw_attachment.length > 0 ? raw_attachment[0].path : null,
      finish_attachment_path:
        finish_attachment.length > 0 ? finish_attachment[0].path : null,
      process_attachment_path:
        process_attachment.length > 0 ? process_attachment[0].path : null,
      product_id,
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };
    const drawing = await Drawing.create(value);
    return res
      .status(200)
      .json({ success: true, message: "Drawing successfully created" });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { newDrawingRegistration, newDrawingRegistrationapi };
