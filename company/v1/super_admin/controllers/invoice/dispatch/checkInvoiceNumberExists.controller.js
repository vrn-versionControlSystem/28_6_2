const DispatchInvoice = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_invoice.model");
const globalError = require("../../../../../../errors/global.error");
const { sequelize } = require("../../../../../../configs/database");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../../utils/helpers/text_checker");

const CheckInvoiceNumberExists = async (req, res, next) => {
  try {
    const { invoice_no } = req.body;

    const newDispatchInvoice = await DispatchInvoice.findOne({
      where: {
        invoice_no: toUpperCaseOrNull(trimSpace(invoice_no)),
        deleted: false,
      },
    });
    if (newDispatchInvoice) {
      return next(globalError(500, "Invoice Number Already Exists"));
    }
    return res.status(200).json({ message: "Invoice Number Is Unique" });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { CheckInvoiceNumberExists };
