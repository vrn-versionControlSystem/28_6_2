const express = require("express");
const {
  getMonthlyProductData,
  getYearlyProductData,
  getSelectedProductSalesData,
  getProductByCategory,
  getTOPSellingProduct,
} = require("../../controllers/dashboard/product/get.controller");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const router = express.Router();

router.post("/dynamic", jwtValidator, getSelectedProductSalesData);
// router.get("/years", jwtValidator, getUniqueYears);
router.post("/month", jwtValidator, getMonthlyProductData);
router.post("/yearly", jwtValidator, getYearlyProductData);
router.get("/by/category", jwtValidator, getProductByCategory);
router.get("/top/selling/product", jwtValidator, getTOPSellingProduct);

module.exports = router;
