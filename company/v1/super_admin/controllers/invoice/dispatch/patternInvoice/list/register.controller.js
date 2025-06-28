const globalError = require("../../../../../../../../errors/global.error");
const PatternInvoiceList = require("../../../../../../../../models/company.models/invoice.models/pattern_invoice.models/pattern_invoice_list");

const newPatternDispatchListRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    console.log("7");
    const { DispatchList = [] } = req.body;

    const poGroupMap = new Map();

    for (const item of DispatchList) {
      for (const list of item.poList) {
        const { quantity } = list;
        const { quantity: orderedQty, po_list_id } = list.PoList;
        const po_id = list.Po.po_id;

        if (!poGroupMap.has(po_id)) {
          poGroupMap.set(po_id, {
            totalDispatched: 0,
            totalOrdered: 0,
          });
        }

        const current = poGroupMap.get(po_id);
        current.totalDispatched += Number(quantity || 0);
        current.totalOrdered += Number(orderedQty || 0);
      }
    }

    const value = DispatchList.map((item) => {
      return {
        item_quantity: parseFloat(item.quantity),
        po_id: item?.Po?.po_id,
        po_list_id: item?.PoList?.po_list_id,
        project_no: item?.PoList?.project_no,
        serial_number: item?.PoList?.serial_number,
        rate: parseFloat(item?.rate),
        no: item?.no,
        number: item?.Po?.number,
        product_id: item?.PoList?.Product?.product_id,
        item_name: item?.PoList?.Product?.name,
        item_code: item?.PoList?.Product?.item_code,
        pump_model: item?.PoList?.Product?.pump_model,
        unit_measurement: item?.PoList?.Product?.unit_measurement,
        hsn_code: item?.PoList?.Product?.hsn_code,
        pattern_invoice_id: req.newPatternInvoice.pattern_invoice_id,
        remark: item?.remark,
      };
    });
    const newDispatchItems = await PatternInvoiceList.bulkCreate(value, {
      returning: true,
      transaction: t,
    });
    if (newDispatchItems.length === 0) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }

    for (const [po_id, group] of poGroupMap.entries()) {
      if (group.totalDispatched === group.totalOrdered) {
        await sequelize.query(
          `UPDATE pos SET status = :newStatus, updatedAt = NOW() WHERE po_id = :po_id`,
          {
            replacements: {
              newStatus: "delivered",
              po_id: po_id,
            },
            transaction: t,
          }
        );
      }
    }

    return next();
  } catch (error) {
    await t.rollback();
    console.log("error6", error.message);
    return next(globalError(500, error.message));
  }
};

module.exports = { newPatternDispatchListRegistration };
