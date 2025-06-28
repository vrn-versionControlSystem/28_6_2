const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const { eWayAuth } = require("../../controllers/eWayBill/auth");
const router = express.Router();

router.post("/login", jwtValidator, eWayAuth);

module.exports = router;
