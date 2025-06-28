const globalError = require("../../../../../../errors/global.error");
const DispatchInvoice = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_invoice.model");
const DispatchList = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_list.model");
const { sequelize } = require("../../../../../../configs/database");

const DeleteInvoice = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { dispatch_invoice_id } = req.body;

    const poIdsData = await DispatchList.findAll({
      where: { dispatch_invoice_id },
      attributes: ["po_id"],
      transaction: t,
    });

    const poIds = [...new Set(poIdsData.map((item) => item.po_id))];

    await DispatchList.destroy({
      where: { dispatch_invoice_id },
      transaction: t,
    });

    await DispatchInvoice.destroy({
      where: { dispatch_invoice_id },
      transaction: t,
    });

    for (const po_id of poIds) {
      await sequelize.query(
        `UPDATE pos SET status = :newStatus, updatedAt = NOW() WHERE po_id = :po_id`,
        {
          replacements: {
            newStatus: "processing",
            po_id: po_id,
          },
          transaction: t,
        }
      );
    }

    await t.commit();
    return res
      .status(200)
      .json({ success: true, message: "Dispatch successfully deleted" });
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = { DeleteInvoice };
