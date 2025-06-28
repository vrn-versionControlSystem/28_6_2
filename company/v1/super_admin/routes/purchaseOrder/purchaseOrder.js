const express = require("express");
const {
  newPurchaseOrderRegistration,
} = require("../../controllers/purchaseOrder/register");
const {
  isPurchaseOrdernumberExist,
} = require("../../controllers/purchaseOrder/isPoNumberExist");
const {
  newPurchaseOrderListRegistration,
} = require("../../controllers/purchaseOrder/purchase_order_list/register");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const {
  getAllPurchaseOrderWithPagination,
  getPurchaseOrderDetailsByPurchaseOrderId,
} = require("../../controllers/purchaseOrder/fetch");
const {
  updatePurchaseOrderStatusByPurhaseOrderId,
  updatePurchaseOrderRegistration,
} = require("../../controllers/purchaseOrder/update");
const {
  deletePurchaseOrder,
} = require("../../controllers/purchaseOrder/delete.controller");
const {
  updatePurchaseOrderListByPurchaseOrderListIdData,
} = require("../../controllers/purchaseOrder/purchase_order_list/update");
const router = express.Router();

router.post(
  "/register",
  jwtValidator,
  newPurchaseOrderRegistration,
  newPurchaseOrderListRegistration
);

router.delete("/delete/id", jwtValidator, deletePurchaseOrder);

router.post("/", jwtValidator, getAllPurchaseOrderWithPagination);
// router.post("/select/customer/id", jwtValidator, getAllPosByCustomerId);
router.post("/id", jwtValidator, getPurchaseOrderDetailsByPurchaseOrderId);
router.post("/status", jwtValidator, updatePurchaseOrderStatusByPurhaseOrderId);
router.put(
  "/update/id",
  jwtValidator,
  updatePurchaseOrderRegistration,
  updatePurchaseOrderListByPurchaseOrderListIdData
);
router.post("/check/number", jwtValidator, isPurchaseOrdernumberExist);

module.exports = router;
