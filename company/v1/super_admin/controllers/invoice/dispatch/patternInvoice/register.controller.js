const dayjs = require("dayjs");
const PatternInvoice = require("../../../../../../../models/company.models/invoice.models/pattern_invoice.models/pattern_invoice");
const globalError = require("../../../../../../../errors/global.error");
const { sequelize } = require("../../../../../../../configs/database");

const newPaternInvoiceRegistration = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { invoice_type, invoice_date = new Date(), invoice_no } = req.body;
    const value = {
      invoice_type,
      invoice_date: dayjs(invoice_date).format("YYYY-MM-DD"),
      invoice_no: invoice_no.toUpperCase(),
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };
    const newPatternInvoice = await PatternInvoice.create(value, {
      transaction: t,
      returning: true,
    });
    if (!newPatternInvoice) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    req.newPatternInvoice = newPatternInvoice.toJSON();
    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    console.log("error2", error.message);
    return next(globalError(500, error.message));
  }
};

module.exports = { newPaternInvoiceRegistration };
