const globalError = require("../../../../../../../errors/global.error");
const DispatchBuyer = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_buyer");

const newDispatchBuyerRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    console.log("4");
    const { customer_id, name, phone, mobile, pan, gst_no, email } =
      req.body.DispatchBuyer;
    const value = {
      dispatch_invoice_id: req.dispatchInvoice
        ? req.dispatchInvoice.dispatch_invoice_id
        : null,
      pattern_invoice_id: req.newPatternInvoice
        ? req.newPatternInvoice.pattern_invoice_id
        : null,
      customer_id,
      name,
      mobile,
      phone,
      gst_no,
      pan,
      email,
    };
    const dispatchBuyer = await DispatchBuyer.create(value, {
      transaction: t,
    });
    if (!dispatchBuyer) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    req.dispatchBuyer = dispatchBuyer.toJSON();
    return next();
  } catch (error) {
    await t.rollback();
    console.log("error4", error.message);
    return next(globalError(500, error.message));
  }
};

module.exports = { newDispatchBuyerRegistration };
