const express = require("express");
const {
  getSelectedCustomerSalesData,
  getUniqueYears,
  getMonthlySalesData,
  getYearlySalesData,
} = require("../../controllers/dashboard/customer/get.controller");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const router = express.Router();

router.post("/dynamic", jwtValidator, getSelectedCustomerSalesData);
router.get("/years", jwtValidator, getUniqueYears);
router.post("/month", jwtValidator, getMonthlySalesData);
router.post("/yearly", jwtValidator, getYearlySalesData);

module.exports = router;
