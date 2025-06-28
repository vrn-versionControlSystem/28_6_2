const express = require("express");
const { testData } = require("../../controllers/Test/test.controller");

const router = express.Router();

router.post("/testData", testData);

module.exports = router;
