const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const {
  newPatternRegistration,
} = require("../../controllers/product/pattern/register.controller");
const {
  getAllPattern,
  getAllPatternWithPagination,
} = require("../../controllers/product/pattern/get.controller");
const {
  updatePatternDetailsByPatternId,
  deletePatternByPatternId,
  updatePatternDispatchListByAddItem,
} = require("../../controllers/product/pattern/update.controller");
const router = express.Router();

router.post("/register", jwtValidator, newPatternRegistration);
router.get("/select", jwtValidator, getAllPattern);
router.post("/", jwtValidator, getAllPatternWithPagination);
router.put("/update", jwtValidator, updatePatternDetailsByPatternId);
router.put("/update/product", jwtValidator, updatePatternDispatchListByAddItem);
router.delete("/delete", jwtValidator, deletePatternByPatternId);

module.exports = router;
