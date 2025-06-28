const express = require("express");
const {
  getCalibration,
} = require("../../controllers/calibration/get.controller");
const {
  deleteCalibration,
} = require("../../controllers/calibration/delete.controller");
const {
  createCalibration,
} = require("../../controllers/calibration/register.controller");

const {
  updateCalibration,
} = require("../../controllers/calibration/update.controller");

const jwtValidator = require("../../../../../utils/validators/token.validator");

const router = express.Router();

router.post("/register", jwtValidator, createCalibration);
router.post("/", jwtValidator, getCalibration);
router.put("/update/id", jwtValidator, updateCalibration);

router.delete("/delete/id", jwtValidator, deleteCalibration);

module.exports = router;
