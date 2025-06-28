const { sequelize } = require("../../../../../../configs/database");
const globalError = require("../../../../../../errors/global.error");
const PurchaseOrderList = require("../../../../../../models/company.models/purchaseOrder_and_purchaseOrderList.models/PurchaseOrderList");
const dayjs = require("dayjs");

const updatePurchaseOrderListByPurchaseOrderListId = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { list_status = "rejected", purchase_order_list_id } = req.body;
    const value = {
      list_status,
    };
    const updatedPurchaseOrderList = await PurchaseOrderList.update(value, {
      where: { purchase_order_list_id },
      transaction: t,
    });
    if (updatedPurchaseOrderList[0] === 0) {
      await t.rollback();
      return next(globalError(404, "Purchase Order list not found"));
    }
    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

const updatePurchaseOrderListReceivedQuantity = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { received_quantity = 0, purchase_order_list_id } = req.body;

    const PurchaseOrderLists = await PurchaseOrderList.findOne({
      where: { purchase_order_list_id },
    });

    const received_Quantity = PurchaseOrderLists.toJSON();
    const value = {
      received_quantity:
        received_quantity + received_Quantity.received_quantity,
    };
    const updatedPurchaseOrderList = await PurchaseOrderList.update(value, {
      where: { purchase_order_list_id },
      transaction: t,
    });
    if (updatedPurchaseOrderList[0] === 0) {
      await t.rollback();
      return next(globalError(404, "Purchase Order list not found"));
    }
    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

const updatePurchaseOrderListStatusAndQuantity = async (req, res, next) => {
  const t = req.t;
  try {
    const { items } = req.body;
    console.log("4");

    for (const item of items) {
      const { quantity, actual_quantity, purchase_order_list_id } = item;

      const purchaseOrder = await PurchaseOrderList.findOne({
        where: {
          purchase_order_list_id: purchase_order_list_id,
        },
        transaction: t,
      });

      if (!purchaseOrder) {
        await t.rollback();
        return next(globalError(404, "Purchase order list not found"));
      }

      const updatedReceivedQuantity =
        Number(purchaseOrder.received_quantity) + Number(actual_quantity);
      const updatedListStatus =
        updatedReceivedQuantity >= Number(quantity)
          ? "received"
          : "partially_received";

      const poUpdate = await PurchaseOrderList.update(
        {
          received_quantity: updatedReceivedQuantity,
          list_status: updatedListStatus,
        },
        {
          where: {
            purchase_order_list_id,
          },
          transaction: t,
        }
      );
      if (poUpdate[0] === 0) {
        await t.rollback();
        return res
          .status(404)
          .json({ success: false, message: "Purchase Order List Not Updated" });
      }
    }

    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

const updatePurchaseOrderListByPurchaseOrderListIdData = async (
  req,
  res,
  next
) => {
  const t = req.t;
  try {
    const { items = [], purchase_order_id } = req.body;

    for (let i = 0; i < items.length; i++) {
      let value = {};
      let total_amount = 0;
      if (
        items[i].gst_type === "GST" &&
        items[i].gst &&
        items[i].price &&
        items[i].quantity
      ) {
        let gstAmount = 0;
        gstAmount =
          (parseFloat(items[i]?.price) *
            parseFloat(items[i]?.quantity) *
            parseFloat(items[i]?.gst)) /
          100;

        const totalWithoutGST =
          parseFloat(items[i]?.price) * parseFloat(items[i]?.quantity);

        total_amount = (
          parseFloat(gstAmount) + parseFloat(totalWithoutGST)
        ).toFixed(2);
      }
      if (items[i].gst_type === "NGST" && items[i].price && items[i].quantity) {
        const totalWithoutGST =
          parseFloat(items[i]?.price) * parseFloat(items[i]?.quantity);

        total_amount = parseFloat(totalWithoutGST).toFixed(2);
      }
      if (items[i].purchase_order_list_id) {
        value.product_id = items[i].Product.product_id;
        value.gst_type = items[i].gst_type;
        value.gst = Number(items[i].gst);
        value.quantity = items[i].quantity || 0;
        value.price = items[i].price || 0;
        value.amount = total_amount;
        value.delivery_date = dayjs(items[i].delivery_date).format(
          "YYYY-MM-DD"
        );
        value.remarks = items[i].remarks;
        console.log(value);
        const updatePOList = await PurchaseOrderList.update(value, {
          where: { purchase_order_list_id: items[i].purchase_order_list_id },
          transaction: t,
        });

        if (updatePOList[0] === 0) {
          await t.rollback();
          res
            .status(400)
            .json({ success: false, message: "Purchase List Not Updated" });
        }
      } else {
        value.purchase_order_id = purchase_order_id;
        value.product_id = items[i].Product.product_id;
        value.gst_type = items[i].gst_type;
        value.gst = Number(items[i].gst);
        value.quantity = items[i].quantity || 0;
        value.price = items[i].price || 0;
        value.amount = total_amount;
        value.delivery_date = dayjs(items[i].delivery_date).format(
          "YYYY-MM-DD"
        );
        value.remarks = items[i].remarks;
        console.log(value);
        const create = await PurchaseOrderList.create(value, {
          transaction: t,
        });

        if (!create) {
          await t.rollback();
          res
            .status(400)
            .json({ success: false, message: "Po List Not Created" });
        }
      }
    }
    await t.commit();
    return res
      .status(200)
      .json({ success: true, message: "PO Updated Successfully" });
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = {
  updatePurchaseOrderListByPurchaseOrderListId,
  updatePurchaseOrderListReceivedQuantity,
  updatePurchaseOrderListStatusAndQuantity,
  updatePurchaseOrderListByPurchaseOrderListIdData,
};
