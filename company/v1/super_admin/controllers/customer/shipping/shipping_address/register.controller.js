const globalError = require("../../../../../../../errors/global.error");
const CustomerShippingAddress = require("../../../../../../../models/company.models/customer.models/customer_shipping_address.model");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
  isNumeric,
} = require("../../../../../../../utils/helpers/text_checker");

const customerNewShippingAddressRegistration = async (req, res, next) => {
  try {
    const {
      contact_person,
      contact_phone = null,
      address,
      country,
      state,
      city,
      zip_code,
      customer_id,
      state_code = null,
    } = req.body;
    const value = {
      customer_id,
      contact_person,
      contact_phone,
      address: toUpperCase(trimSpace(address)),
      country: toUpperCase(trimSpace(country)),
      state: toUpperCase(trimSpace(state)),
      city: toUpperCaseOrNull(trimSpace(city)),
      zip_code: isNumeric?.(trimSpace(zip_code)) ? trimSpace(zip_code) : null,
      state_code,
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };
    const newAddress = await CustomerShippingAddress.create(value, {
      returning: true,
    });
    if (!newAddress) {
      return next(globalError(500, "Something went wrong"));
    }
    return res.status(201).json({
      success: true,
      data: newAddress,
      message: `Address successfully created`,
    });
  } catch (error) {
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = { customerNewShippingAddressRegistration };
