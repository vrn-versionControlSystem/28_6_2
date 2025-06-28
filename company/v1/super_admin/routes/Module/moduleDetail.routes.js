const express = require("express");
const {
  addModuleDetail,
} = require("../../controllers/Module/ModuleDetail/register.controller");
const {
  getAllModules,
} = require("../../controllers/Module/ModuleDetail/get.controller");
const {
  updateModule,
} = require("../../controllers/Module/ModuleDetail/update.controller");
const jwtValidator = require("../../../../../utils/validators/token.validator");

const router = express.Router();

router.post("/register", jwtValidator, addModuleDetail);
router.post("/", jwtValidator, getAllModules);
router.put("/update", jwtValidator, updateModule);

module.exports = router;
