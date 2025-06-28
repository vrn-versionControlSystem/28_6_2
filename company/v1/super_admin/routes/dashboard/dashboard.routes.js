const express = require("express");
const {
  getTop10DispatchItems,
  getChartData,
  statisticData,
  Orders,
  pendingPOs,
  Revenue,
  Purchases,
  Customers,
  getTodaysCustomerSales,
  getTodaysOrders,
} = require("../../controllers/dashboard/get.controller");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const { latest10Pos } = require("../../controllers/po/get.controller");
const router = express.Router();

router.get(
  "/",
  jwtValidator,
  getChartData,
  statisticData,
  latest10Pos,
  Orders,
  pendingPOs,
  Revenue,
  Purchases,
  Customers,
  getTop10DispatchItems,
  getTodaysCustomerSales,
  getTodaysOrders
);

module.exports = router;
