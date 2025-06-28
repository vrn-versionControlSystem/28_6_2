const express = require("express");

const {
  getAllQuality,
  getAllProductsByCustomerId,
} = require("../../controllers/Quality/get.controller");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const router = express.Router();

router.post("/lists", jwtValidator, getAllQuality);
router.post("/select/customer/id", jwtValidator, getAllProductsByCustomerId);

module.exports = router;
