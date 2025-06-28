const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../utils/helpers/text_checker");
const Product = require("../../../../../models/company.models/product.models/product.model");
const DispatchList = require("../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_list.model");
const globalError = require("../../../../../errors/global.error");
const { sequelize } = require("../../../../../configs/database");

const updateProduct = async (req, res, next) => {
  const t = await sequelize.transaction();
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
      quality_lead_time,
      raw_lead_time,
      machine_lead_time,
      standard_lead_time_type,
      machine_lead_time_type,
      raw_lead_time_type,
      quality_lead_time_type,
      gst_percentage,
      product_id,
    } = req.body;

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
      quality_lead_time,
      raw_lead_time,
      machine_lead_time,
      standard_lead_time_type,
      machine_lead_time_type,
      raw_lead_time_type,
      quality_lead_time_type,
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };

    const updateProduct = await Product.update(value, {
      where: { product_id: product_id },
      transaction: t,
    });

    if (updateProduct[0] === 0) {
      await t.rollback();
      return next(globalError(500, "Product Not Updated"));
    }

    req.t = t;

    req.values = req.body;

    return next();
  } catch (error) {
    await t.rollback();
    if (error?.errors.length > 0) {
      return next(globalError(409, error.errors[0].message));
    }

    return next(globalError(500, error.message));
  }
};

const updateProductDetailInInvoice = async (req, res, next) => {
  const t = req.t;
  // console.log("t", t);taaws
  try {
    const {
      name,
      item_code,
      pump_model,
      unit_measurement,
      hsn_code,
      description,
      product_id,
    } = req.values;
    const value = {
      item_name: toUpperCase(trimSpace(name)),
      item_code: toUpperCaseOrNull(trimSpace(item_code)),
      hsn_code: toUpperCaseOrNull(trimSpace(hsn_code)),
      pump_model: toUpperCaseOrNull(trimSpace(pump_model)),
      unit_measurement,
      description,
    };

    const dispatchProduct = await DispatchList.findOne({
      where: { product_id: product_id },
    });

    if (dispatchProduct) {
      const updateProduct = await DispatchList.update(value, {
        where: { product_id: product_id },
        transaction: t,
      });

      if (updateProduct[0] === 0) {
        await t.rollback();
        return next(globalError(500, "Product Not Updateds"));
      }
    }

    await t.commit();
    return res.status(201).json({
      success: true,
      message: "Product Successfully updated",
    });
  } catch (error) {
    await t.rollback();
    if (error?.errors.length > 0) {
      return next(globalError(409, error.errors[0].message));
    }
    return next(globalError(500, error.message));
  }
};

module.exports = { updateProduct, updateProductDetailInInvoice };
