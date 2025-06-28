const express = require("express");
const {
  getBreakdown,
} = require("../../controllers/machine/breakdown/get.controller");
const {
  deleteBreakdown,
} = require("../../controllers/machine/breakdown/delete.controller");
const {
  createBreakdown,
} = require("../../controllers/machine/breakdown/register.controller");

const {
  updateBreakdown,
} = require("../../controllers/machine/breakdown/update.controller");

const jwtValidator = require("../../../../../utils/validators/token.validator");

const router = express.Router();

router.post("/register", jwtValidator, createBreakdown);
router.post("/", jwtValidator, getBreakdown);
router.put("/update/id", jwtValidator, updateBreakdown);

router.delete("/delete/id", jwtValidator, deleteBreakdown);

module.exports = router;
