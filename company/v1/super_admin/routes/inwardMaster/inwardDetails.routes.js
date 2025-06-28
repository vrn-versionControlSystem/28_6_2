const express = require("express");
const {
  getNewVcodeNumber,
} = require("../../controllers/inWardMaster/inwardDetails/get.controller");

const jwtValidator = require("../../../../../utils/validators/token.validator");

const router = express.Router();

router.get("/generate/vcode", jwtValidator, getNewVcodeNumber);
module.exports = router;
