const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const { newCategoryRegistration } = require("../../controllers/product/category/register.controller");
const { getAllCategoryWithPagination, getAllCategory } = require("../../controllers/product/category/get.controller");
const { updateCategoryDetailsByCategoryId, deleteCategoryByCategoryId } = require("../../controllers/product/category/update.controller");
const router = express.Router();

router.post("/register", jwtValidator, newCategoryRegistration);
router.get("/select", jwtValidator, getAllCategory);
router.post("/", jwtValidator, getAllCategoryWithPagination);
router.put("/update", jwtValidator, updateCategoryDetailsByCategoryId);
router.delete("/delete", jwtValidator, deleteCategoryByCategoryId);

module.exports = router;
