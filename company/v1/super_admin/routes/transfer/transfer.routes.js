const express = require("express");
const {
  databaseToDisk,
} = require("../../controllers/Transfer/register.controller");


const jwtValidator = require("../../../../../utils/validators/token.validator");

const router = express.Router();

router.post(
  "/transfer",
  jwtValidator,
  databaseToDisk
);


module.exports = router;
