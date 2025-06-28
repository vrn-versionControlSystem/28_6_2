const express = require("express");
const {
  getCalibrationOneMonthLater,
  getTotalInstrument,
  getTotalOverDueCalibration,
  Recent10Calibration,
  totalCalibrations,
  getCalibrationPieChart,
} = require("../../controllers/dashboard/Instruments/get.controller");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const router = express.Router();

router.post("/", jwtValidator, getCalibrationOneMonthLater);
router.get(
  "/static",
  jwtValidator,
  getTotalInstrument,
  getTotalOverDueCalibration,
  Recent10Calibration,
  totalCalibrations,
  getCalibrationPieChart
);

module.exports = router;
