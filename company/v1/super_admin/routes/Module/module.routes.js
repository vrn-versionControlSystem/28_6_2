const express = require("express");
const {
  newmoduleReg,
} = require("../../controllers/Module/register.controller");
const { getModules } = require("../../controllers/Module/get.controller");

const jwtValidator = require("../../../../../utils/validators/token.validator");

const router = express.Router();

router.post("/register", newmoduleReg);
router.post("/", getModules);

module.exports = router;
