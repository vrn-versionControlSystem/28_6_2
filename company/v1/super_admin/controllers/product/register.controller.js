const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../utils/helpers/text_checker");
const Product = require("../../../../../models/company.models/product.models/product.model");
const globalError = require("../../../../../errors/global.error");
const newProductRegistration = async (req, res, next) => {
  try {
    const {
      pattern_id,
      drawing_number,
      category_id,
      material_grade_id,
      name,
      item_code,
      row_code,
      pump_model,
      unit_measurement,
      hsn_code,
      description,
      standard_lead_time,
      standard_lead_time_type,
      raw_lead_time,
      raw_lead_time_type,
      machine_lead_time,
      machine_lead_time_type,
      quality_lead_time,
      quality_lead_time_type,
      gst_percentage,
    } = req.body;

    console.log("req.body", req.body);

    const value = {
      drawing_number: toUpperCase(trimSpace(drawing_number)),
      pattern_id,
      category_id,
      material_grade_id,
      name: toUpperCase(trimSpace(name)),
      item_code: toUpperCaseOrNull(trimSpace(item_code)),
      row_code: toUpperCaseOrNull(trimSpace(row_code)),
      hsn_code: toUpperCaseOrNull(trimSpace(hsn_code)),
      pump_model: toUpperCaseOrNull(trimSpace(pump_model)),
      gst_percentage: toUpperCaseOrNull(trimSpace(gst_percentage)),
      unit_measurement,
      description,
      standard_lead_time,
      standard_lead_time_type,
      raw_lead_time,
      raw_lead_time_type,
      machine_lead_time,
      machine_lead_time_type,
      quality_lead_time,
      quality_lead_time_type,
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };

    const newProduct = await Product.create(value);
    if (!newProduct) {
      return next(globalError(500, "Something went wrong"));
    }
    return res.status(201).json({
      success: true,
      message: "Product Successfully Created",
      data: newProduct.toJSON(),
    });
  } catch (error) {
    if (error?.errors.length > 0) {
      return next(globalError(409, error.errors[0].message));
    }
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = { newProductRegistration };
