const globalError = require("../../../../../../../errors/global.error");
const CustomerShippingAddress = require("../../../../../../../models/company.models/customer.models/customer_shipping_address.model");

const deleteCustomerShippingAddress = async (req, res, next) => {
  try {
    const { shipping_address_id } = req.body;
    const value = {
      deleted: true,
    };
    const Address = await CustomerShippingAddress.update(value, {
      where: { shipping_address_id },
    });
    if (!Address) {
      return next(globalError(500, "Something went wrong"));
    }
    return res.status(200).json({
      success: true,
      message: `Address successfully deleted`,
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { deleteCustomerShippingAddress };
