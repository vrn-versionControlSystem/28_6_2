const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const {
  newMaterialGradeRegistration,
} = require("../../controllers/product/material_grade/register.controller");
const {
  getAllMaterialGrade,
  getAllMaterialGradeWithPagination,
  getAllMaterialGradeASOption,
} = require("../../controllers/product/material_grade/get.controller");
const {
  updateMaterialGradeDetailsByMaterialGradeId,
  deleteMaterialGradeByMaterialGradeId,
} = require("../../controllers/product/material_grade/update.controller");
const router = express.Router();

router.post("/register", jwtValidator, newMaterialGradeRegistration);
router.get("/select", jwtValidator, getAllMaterialGrade);
router.post("/", jwtValidator, getAllMaterialGradeWithPagination);
router.put(
  "/update",
  jwtValidator,
  updateMaterialGradeDetailsByMaterialGradeId
);
router.delete("/delete", jwtValidator, deleteMaterialGradeByMaterialGradeId);
router.get("/option", jwtValidator, getAllMaterialGradeASOption);

module.exports = router;
