const globalError = require("../../../../../../../errors/global.error");
const DispatchNote = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_note");

const newDispatchNoteRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    const { condition_id, condition } = req.body.DispatchNote;
    const value = {
      dispatch_invoice_id: req.dispatchInvoice.dispatch_invoice_id,
      condition_id,
      condition,
    };
    const newDispatchNote = await DispatchNote.create(value, {
      transaction: t,
    });
    if (!newDispatchNote) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }

    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { newDispatchNoteRegistration };
