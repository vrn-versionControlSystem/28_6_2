const PatternInvoice = require("../../../../../../../models/company.models/invoice.models/pattern_invoice.models/pattern_invoice");
const globalError = require("../../../../../../../errors/global.error");
const { sequelize } = require("../../../../../../../configs/database");

const CheckPatternInvoiceNumberExists = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    console.log("1");
    const { invoice_no } = req.body;

    const Invoice = await PatternInvoice.findOne({
      where: {
        invoice_no: invoice_no.toUpperCase(),
        deleted: false,
      },
      transaction: t,
      returning: true,
    });
    if (Invoice) {
      await t.rollback();
      return next(globalError(500, "Invoice Number Already Exists"));
    }
    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { CheckPatternInvoiceNumberExists };
