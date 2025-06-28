const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const { getAllPoWithPagination, getPoDetailsByPoId } = require("../../controllers/po/get.controller");
const router = express.Router();

router.post("/", jwtValidator, getAllPoWithPagination);
router.post("/id", jwtValidator, getPoDetailsByPoId);

module.exports = router;
