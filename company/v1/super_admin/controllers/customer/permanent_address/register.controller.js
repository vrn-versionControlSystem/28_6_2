const globalError = require("../../../../../../errors/global.error");
const CustomerPermanentAddress = require("../../../../../../models/company.models/customer.models/customer_permanent_address.model");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
  isNumeric,
} = require("../../../../../../utils/helpers/text_checker");

const customerNewPermanentAddressRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    const {
      address,
      country,
      state,
      city,
      zip_code,
      state_code = null,
    } = req.body.CustomerPermanentAddress;
    const value = {
      customer_id: req.customer.customer_id,
      address: toUpperCase(trimSpace(address)),
      country: toUpperCase(trimSpace(country)),
      state: toUpperCase(trimSpace(state)),
      city: toUpperCaseOrNull(trimSpace(city)),
      zip_code: zip_code,
      state_code,
    };
    const customerPermanentAddress = await CustomerPermanentAddress.create(
      value,
      {
        transaction: t,
      }
    );
    if (!customerPermanentAddress) {
      await t.rollback();
      return next(globalError(500, "something went wrong"));
    }

    await t.commit();
    return res.status(201).json({
      success: true,
      message: `Customer successfully created`,
      data: req.customer,
    });
  } catch (error) {
    await t.rollback();
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = { customerNewPermanentAddressRegistration };
