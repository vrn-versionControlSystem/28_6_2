const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../utils/helpers/text_checker");
const Product = require("../../../../../models/company.models/product.models/product.model");
const globalError = require("../../../../../errors/global.error");
const deleteProduct = async (req, res, next) => {
  try {
    const { product_id } = req.body;
    const value = {
      deleted: true,
    };

    const deleteProduct = await Product.update(
      { deleted: true },
      {
        where: { product_id: product_id },
      }
    );
    if (deleteProduct[0] === 0) {
      return next(globalError(500, "Product Not deleted"));
    }
    return res.status(201).json({
      success: true,
      message: "Product Successfully deleted",
    });
  } catch (error) {
    console.log("error", error);
    // if (error?.errors.length > 0) {
    //   return next(globalError(409, error.errors[0].message));
    // }
    // return next(globalError(500, error.message));
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { deleteProduct };
