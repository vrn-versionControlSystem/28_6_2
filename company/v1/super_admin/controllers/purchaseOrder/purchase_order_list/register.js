const dayjs = require("dayjs");
const PurchaseOrderList = require("../../../../../../models/company.models/purchaseOrder_and_purchaseOrderList.models/PurchaseOrderList");
const globalError = require("../../../../../../errors/global.error");

const newPurchaseOrderListRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    const { items = [] } = req.body;
    const value = items.map((item) => {
      let total_amount = 0;
      if (item.gst_type === "GST" && item.gst && item.price && item.quantity) {
        let gstAmount = 0;
        gstAmount =
          (parseFloat(item?.price) *
            parseFloat(item?.quantity) *
            parseFloat(item?.gst)) /
          100;

        const totalWithoutGST =
          parseFloat(item?.price) * parseFloat(item?.quantity);

        total_amount = (
          parseFloat(gstAmount) + parseFloat(totalWithoutGST)
        ).toFixed(2);
      }
      if (item.gst_type === "NGST" && item.price && item.quantity) {
        const totalWithoutGST =
          parseFloat(item?.price) * parseFloat(item?.quantity);

        total_amount = parseFloat(totalWithoutGST).toFixed(2);
      }
      return {
        purchase_order_id: req.po.purchase_order_id,
        product_id: item.Product.product_id,
        gst_type: item.gst_type,
        gst: Number(item.gst),
        quantity: item.quantity || 0,
        price: parseFloat(item.price) || 0,
        amount: total_amount || 0,
        remarks: item?.remarks,
        delivery_date: dayjs(item.delivery_date).format("YYYY-MM-DD"),
      };
    });
    const newPoList = await PurchaseOrderList.bulkCreate(value, {
      transaction: t,
    });
    if (!newPoList) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    // Commit the transaction since it's successful
    await t.commit();
    res.status(200).json({ message: "Purchase Order successfully created" });
  } catch (error) {
    // Check if the transaction is still active before rolling back
    if (t.finished !== "rollback") {
      await t.rollback();
    }
    return next(globalError(500, error.message));
  }
};

module.exports = { newPurchaseOrderListRegistration };
