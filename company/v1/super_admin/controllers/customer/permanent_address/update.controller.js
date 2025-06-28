const globalError = require("../../../../../../errors/global.error");
const CustomerPermanentAddress = require("../../../../../../models/company.models/customer.models/customer_permanent_address.model");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
  isNumeric,
} = require("../../../../../../utils/helpers/text_checker");

const updatecustomerNewPermanentAddressRegistration = async (
  req,
  res,
  next
) => {
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
    const { customer_id } = req.body;
    const value = {
      address: toUpperCase(trimSpace(address)),
      country: toUpperCase(trimSpace(country)),
      state: toUpperCase(trimSpace(state)),
      city: toUpperCaseOrNull(trimSpace(city)),
      zip_code: zip_code,
      state_code,
    };
    const customerPermanentAddress = await CustomerPermanentAddress.update(
      value,
      {
        where: { customer_id: customer_id },
        transaction: t,
      }
    );
    if (customerPermanentAddress[0] == 0) {
      await t.rollback();
      return next(globalError(500, "Customer NOt Updated"));
    }

    await t.commit();
    return res.status(201).json({
      success: true,
      message: `Customer successfully Updated`,
    });
  } catch (error) {
    await t.rollback();
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = { updatecustomerNewPermanentAddressRegistration };
