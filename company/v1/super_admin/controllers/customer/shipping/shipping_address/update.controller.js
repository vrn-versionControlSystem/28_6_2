const globalError = require("../../../../../../../errors/global.error");
const CustomerShippingAddress = require("../../../../../../../models/company.models/customer.models/customer_shipping_address.model");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
  isNumeric,
} = require("../../../../../../../utils/helpers/text_checker");

const updateCustomerShippingAddressRegistration = async (req, res, next) => {
  try {
    const {
      contact_person,
      contact_phone,
      address,
      country,
      state,
      city,
      zip_code,
      customer_id,
      shipping_address_id,
      state_code = null,
    } = req.body;
    const value = {
      customer_id,
      contact_person,
      contact_phone,
      state_code,
      address: toUpperCase(trimSpace(address)),
      country: toUpperCase(trimSpace(country)),
      state: toUpperCase(trimSpace(state)),
      city: toUpperCaseOrNull(trimSpace(city)),
      zip_code: isNumeric?.(trimSpace(zip_code)) ? trimSpace(zip_code) : null,
    };
    const Address = await CustomerShippingAddress.update(value, {
      where: { shipping_address_id },
    });
    if (!Address) {
      return next(globalError(500, "Something went wrong"));
    }
    return res.status(200).json({
      success: true,
      data: req.body,
      message: `Address successfully updated`,
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { updateCustomerShippingAddressRegistration };
