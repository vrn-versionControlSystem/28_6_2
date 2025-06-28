const globalError = require("../../../../../../../errors/global.error");
const DispatchConsigneeAddress = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_consignee_address");

const newDispatchConsigneeAddressRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    console.log("5");
    const {
      address,
      country,
      state,
      city,
      zip_code,
      address_id,
      state_code = null,
    } = req.body.DispatchConsignee.CustomerPermanentAddress;
    const value = {
      dispatch_invoice_id: req.dispatchInvoice
        ? req.dispatchInvoice.dispatch_invoice_id
        : null,
      pattern_invoice_id: req.newPatternInvoice
        ? req.newPatternInvoice.pattern_invoice_id
        : null,
      customer_id: req.body.DispatchConsignee.customer_id,
      dispatch_consignee_id: req.dispatchConsignee.dispatch_consignee_id,
      address_id,
      address,
      country,
      state,
      city,
      zip_code,
      state_code,
    };
    const newPermanentAddress = await DispatchConsigneeAddress.create(value, {
      returning: true,
      transaction: t,
    });
    if (!newPermanentAddress) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { newDispatchConsigneeAddressRegistration };
