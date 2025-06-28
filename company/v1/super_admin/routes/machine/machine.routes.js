const express = require("express");
const {
  getMachine,
} = require("../../controllers/machine/machines/get.controller");
const {
  deleteMachine,
} = require("../../controllers/machine/machines/delete.controller");
const {
  createMachine,
} = require("../../controllers/machine/machines/register.controller");

const {
  updateMachine,
} = require("../../controllers/machine/machines/update.controller");

const jwtValidator = require("../../../../../utils/validators/token.validator");

const router = express.Router();

router.post("/register", jwtValidator, createMachine);
router.post("/", jwtValidator, getMachine);
router.put("/update/id", jwtValidator, updateMachine);

router.delete("/delete/id", jwtValidator, deleteMachine);

module.exports = router;
