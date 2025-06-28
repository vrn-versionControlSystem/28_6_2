const globalError = require("../../../../../../../errors/global.error");
const DispatchShippingAddress = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_shipping_address");

const newDispatchShippingAddressRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    console.log("6");
    const {
      address,
      country,
      state,
      city,
      zip_code,
      contact_person,
      contact_mobile,
      state_code = null,
      shipping_address_id,
    } = req.body.DispatchShippingAddress;
    const value = {
      dispatch_invoice_id: req.dispatchInvoice
        ? req.dispatchInvoice.dispatch_invoice_id
        : null,
      pattern_invoice_id: req.newPatternInvoice
        ? req.newPatternInvoice.pattern_invoice_id
        : null,
      customer_id: req.body.DispatchConsignee.customer_id,
      dispatch_buyer_id: req.dispatchBuyer.dispatch_buyer_id,
      shipping_address_id,
      address,
      country,
      state,
      city,
      zip_code,
      state_code,
      contact_person,
      contact_mobile,
    };
    const newPermanentAddress = await DispatchShippingAddress.create(value, {
      returning: true,
      transaction: t,
    });
    if (!newPermanentAddress) {
      await t.rollback();
      return next(globalError(500, error.message));
    }
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { newDispatchShippingAddressRegistration };
