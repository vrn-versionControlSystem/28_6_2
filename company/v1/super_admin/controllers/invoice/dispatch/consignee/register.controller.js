const globalError = require("../../../../../../../errors/global.error");
const DispatchConsignee = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_consignee");

const newDispatchConsigneeRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    const {
      customer_id,
      name,
      phone,
      mobile,
      pan,
      gst_no,
      email,
      customer_code,
    } = req.body.DispatchConsignee;
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
      customer_code,
    };
    const dispatchConsignee = await DispatchConsignee.create(value, {
      transaction: t,
    });
    if (!dispatchConsignee) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    req.dispatchConsignee = dispatchConsignee.toJSON();

    return next();
  } catch (error) {
    await t.rollback();
    console.log("error3", error.message);
    return next(globalError(500, error.message));
  }
};

module.exports = { newDispatchConsigneeRegistration };
