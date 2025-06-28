const express = require("express");
const {
  getMasterProductPlannerReport,
  getAllPoExcelReport,
} = require("../../controllers/ExcelReports/get.controller");
const jwtValidator = require("../../../../../utils/validators/token.validator");

const router = express.Router();

router.post("/master/PP", jwtValidator, getMasterProductPlannerReport);
router.post("/sale/orderList", jwtValidator, getAllPoExcelReport);

module.exports = router;
