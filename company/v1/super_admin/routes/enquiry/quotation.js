const express = require("express");
const {
  newCircleQuotationRegistration,
} = require("../../controllers/enquiry/circle/register.controller");

const jwtValidator = require("../../../../../utils/validators/token.validator");

const router = express.Router();

router.post("/register", jwtValidator, newCircleQuotationRegistration);

module.exports = router;
