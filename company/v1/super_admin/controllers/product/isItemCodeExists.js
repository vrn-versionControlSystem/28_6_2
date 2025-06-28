const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../utils/helpers/text_checker");
const Product = require("../../../../../models/company.models/product.models/product.model");
const globalError = require("../../../../../errors/global.error");

const isItemCodeExists = async (req, res, next) => {
  try {
    const { item_code } = req.body;

    const check = await Product.findOne({
      where: {
        item_code: toUpperCaseOrNull(trimSpace(item_code)),
        deleted: false,
      },
    });

    if (check) {
      return next(globalError(404, "Item Code Already Present"));
    }

    return res.status(201).json({
      success: true,
      message: "Unique Item Code",
    });
  } catch (error) {
    if (error?.errors.length > 0) {
      return next(globalError(409, error.errors[0].message));
    }
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = { isItemCodeExists };
