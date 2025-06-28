const express = require("express");
const {
  updatePurchaseOrderListByPurchaseOrderListId,
  updatePurchaseOrderListReceivedQuantity,
} = require("../../controllers/purchaseOrder/purchase_order_list/update");
// const {
//   getAllProductListByPOId,
// } = require("../../controllers/po/po_list/get.controller");
const {
  updatePurchaseOrderStatusByPurhaseOrderId,
  updatePurchaseOrderStatusByPurhaseOrderIdOnQuantityRecevied,
} = require("../../controllers/purchaseOrder/update");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const router = express.Router();

router.put(
  "/id",
  jwtValidator,
  updatePurchaseOrderListByPurchaseOrderListId,
  updatePurchaseOrderStatusByPurhaseOrderId
);
router.put(
  "/quantity/id",
  jwtValidator,
  updatePurchaseOrderListReceivedQuantity,
  updatePurchaseOrderStatusByPurhaseOrderIdOnQuantityRecevied
);

module.exports = router;
