const globalError = require("../../../../../../../errors/global.error");
const DispatchCompanyDetails = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_company_details");

const newDispatchCompanyDetailsRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    console.log("8");
    const {
      iec_code = "",
      gstin = "",
      itc_code = "",
      duty_drawback_serial_no = "",
      state = "",
      pan = "",
      state_code = "",
    } = req.body.DispatchCompanyDetails;
    const value = {
      dispatch_invoice_id: req.dispatchInvoice
        ? req.dispatchInvoice.dispatch_invoice_id
        : null,
      pattern_invoice_id: req.newPatternInvoice
        ? req.newPatternInvoice.pattern_invoice_id
        : null,
      iec_code,
      gstin,
      itc_code,
      duty_drawback_serial_no,
      state,
      pan,
      state_code,
    };
    const dispatchCompanyDetails = await DispatchCompanyDetails.create(value, {
      transaction: t,
    });
    if (!dispatchCompanyDetails) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    return next();
  } catch (error) {
    await t.rollback();
    console.log("error8", error.message);

    return next(globalError(500, error.message));
  }
};

module.exports = { newDispatchCompanyDetailsRegistration };
