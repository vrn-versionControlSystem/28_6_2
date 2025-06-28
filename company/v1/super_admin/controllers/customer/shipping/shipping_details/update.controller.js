const globalError = require("../../../../../../../errors/global.error");
const CustomerShippingDetails = require("../../../../../../../models/company.models/customer.models/customer_shipping_details");

const updatecustomerShippingDetails = async (req, res, next) => {
  try {
    const {
      pre_carriage_by,
      place_of_receipt,
      port_of_discharge,
      country_of_goods,
      destination,
      port_of_loading,
      final_destination,
      customer_id,
      shipping_details_id,
    } = req.body;
    const value = {
      customer_id,
      pre_carriage_by,
      place_of_receipt,
      port_of_discharge,
      country_of_goods,
      destination,
      port_of_loading,
      final_destination,
    };
    const Shipping = await CustomerShippingDetails.update(value, {
      where: {
        shipping_details_id,
      },
    });
    if (!Shipping) {
      return next(globalError(500, "Something went wrong"));
    }
    return res.status(200).json({
      success: true,
      data: req.body,
      message: `Shipping details successfully updated`,
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { updatecustomerShippingDetails };
