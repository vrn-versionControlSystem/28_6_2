const globalError = require("../../../../../errors/global.error");
const PurchaseOrder = require("../../../../../models/company.models/purchaseOrder_and_purchaseOrderList.models/purchaseOrder");
const { sequelize } = require("../../../../../configs/database");
const dayjs = require("dayjs");

const deletePurchaseOrder = async (req, res, next) => {
  try {
    const { purchase_order_id } = req.body;
    let value = {
      deleted: true,
    };
    const updatedPo = await PurchaseOrder.update(value, {
      where: { purchase_order_id },
    });
    if (updatedPo[0] === 0) {
      return next(globalError(404, "Purchase Order not found"));
    }

    return res
      .status(200)
      .json({ success: true, message: `Purcahse Order Deleted Successfully` });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  deletePurchaseOrder,
};
