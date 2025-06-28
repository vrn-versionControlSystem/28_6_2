const globalError = require("../../../../../../../errors/global.error");
const DispatchShippingDetails = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_shipping_details");

const newDispatchShippingDetailsRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    console.log("9");
    const {
      pre_carriage_by,
      place_of_receipt,
      port_of_discharge,
      country_of_goods,
      destination,
      port_of_loading,
      final_destination,
    } = req.body.DispatchShippingDetails;
    const value = {
      dispatch_invoice_id: req.dispatchInvoice
        ? req.dispatchInvoice.dispatch_invoice_id
        : null,
      pattern_invoice_id: req.newPatternInvoice
        ? req.newPatternInvoice.pattern_invoice_id
        : null,
      pre_carriage_by,
      place_of_receipt,
      port_of_discharge,
      country_of_goods,
      destination,
      port_of_loading,
      final_destination,
    };
    const newShipping = await DispatchShippingDetails.create(value, {
      transaction: t,
    });
    if (!newShipping) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { newDispatchShippingDetailsRegistration };
