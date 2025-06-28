const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../../../utils/helpers/text_checker");
const DispatchBankDetails = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_bank_details");
const globalError = require("../../../../../../../errors/global.error");

const newDispatchBankDetailsRegistration = async (req, res, next) => {
  const t = req.t;

  try {
    console.log("8");
    const {
      beneficiary_name,
      bank_name,
      account_no,
      account_type,
      ifsc_code,
      swift_code,
      bank_ad_code,
      branch_address,
    } = req.body.DispatchBankDetails;
    const value = {
      dispatch_invoice_id: req.dispatchInvoice
        ? req.dispatchInvoice.dispatch_invoice_id
        : null,
      pattern_invoice_id: req.newPatternInvoice
        ? req.newPatternInvoice.pattern_invoice_id
        : null,
      beneficiary_name: toUpperCase(trimSpace(beneficiary_name)),
      bank_name: toUpperCase(trimSpace(bank_name)),
      account_no: Number(toUpperCaseOrNull(trimSpace(account_no))),
      account_type: toUpperCaseOrNull(trimSpace(account_type)),
      ifsc_code: toUpperCase(trimSpace(ifsc_code)),
      swift_code: toUpperCaseOrNull(trimSpace(swift_code)),
      bank_ad_code: toUpperCaseOrNull(trimSpace(bank_ad_code)),
      branch_address: toUpperCaseOrNull(trimSpace(branch_address)),
    };

    const newDispatchBankDetails = await DispatchBankDetails.create(value, {
      transaction: t,
    });
    if (!newDispatchBankDetails) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { newDispatchBankDetailsRegistration };
