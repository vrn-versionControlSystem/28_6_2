const globalError = require("../../../../../../../errors/global.error");
const CustomerShippingDetails = require("../../../../../../../models/company.models/customer.models/customer_shipping_details");

const deletecustomerShippingDetails = async (req, res, next) => {
  try {
    const { shipping_details_id } = req.body;
    const value = {
      deleted: true,
    };
    const Shipping = await CustomerShippingDetails.update(value, {
      where: {
        shipping_details_id,
      },
    });
    if (!Shipping) {
      return next(globalError(500, "Something went wrong"));
    }
    return res.status(201).json({
      success: true,
      message: `Shipping details successfully Deleted`,
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { deletecustomerShippingDetails };
