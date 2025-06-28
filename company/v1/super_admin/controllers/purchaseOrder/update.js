const globalError = require("../../../../../errors/global.error");
const PurchaseOrder = require("../../../../../models/company.models/purchaseOrder_and_purchaseOrderList.models/purchaseOrder");
const PurchaseOrderList = require("../../../../../models/company.models/purchaseOrder_and_purchaseOrderList.models/PurchaseOrderList");
const { sequelize } = require("../../../../../configs/database");
const dayjs = require("dayjs");

const updatePurchaseOrderStatusByPurhaseOrderId = async (req, res, next) => {
  try {
    const {
      status = "rejected",
      purchase_order_id,
      status_remark = null,
    } = req.body;
    let value = {
      status,
      status_remark,
    };
    const updatedPo = await PurchaseOrder.update(value, {
      where: { purchase_order_id },
    });
    if (updatedPo[0] === 0) {
      return next(globalError(404, "Purchase Order not found"));
    }

    return res
      .status(200)
      .json({ success: true, message: `List successfully ${status}` });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const updatePurchaseOrderStatusByPurhaseOrderIdOnQuantityRecevied = async (
  req,
  res,
  next
) => {
  const t = req.t;
  try {
    console.log("5");
    const { purchase_order_id } = req.body;
    let value = {};
    const PoAcceptList = await PurchaseOrderList.findAll({
      where: {
        purchase_order_id,
      },
      transaction: t,
    });

    const acceptedPOs = PoAcceptList.filter(
      (list) => list.recevied_quantity !== list.quantity
    );

    if (acceptedPOs.length > 0) {
      value = {
        status: "processing",
      };
    } else {
      value = {
        status: "received",
      };
    }

    const updatedPo = await PurchaseOrder.update(value, {
      where: { purchase_order_id },
      transaction: t,
    });
    if (updatedPo[0] === 0) {
      await t.rollback();
      return next(globalError(404, "Purchase Order not found"));
    }
    await t.commit();
    return res
      .status(200)
      .json({ success: true, message: "Inwarded Successfully" });
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

const updatePurchaseOrderRegistration = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      number,
      Customer,
      date = new Date(),
      currency_type = "INR",
      purchase_order_id,
    } = req.body;
    const value = {
      number,
      customer_id: Customer.customer_id,
      currency_type,
      date: dayjs(date).format("YYYY-MM-DD"),
    };
    const updatePo = await PurchaseOrder.update(value, {
      where: { purchase_order_id },
      transaction: t,
    });
    if (updatePo[0] === 0) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }

    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = {
  updatePurchaseOrderStatusByPurhaseOrderId,
  updatePurchaseOrderStatusByPurhaseOrderIdOnQuantityRecevied,
  updatePurchaseOrderRegistration,
};
