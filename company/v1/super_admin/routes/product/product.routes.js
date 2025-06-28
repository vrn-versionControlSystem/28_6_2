const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const {
  newProductRegistration,
} = require("../../controllers/product/register.controller");
const {
  getAllProductsWithPagination,
  getAllProductsCodeAsOption,
  getProductByCategoryId,
  getProductDetailsByProductId,
  getAllProductsItemCodeAsOption,
  getAllProductsAsOption,
} = require("../../controllers/product/get.controller");
const {
  updateProduct,
  updateProductDetailInInvoice,
} = require("../../controllers/product/update.controller");

const {
  deleteProduct,
} = require("../../controllers/product/delete.controller");

const {
  isItemCodeExists,
} = require("../../controllers/product/isItemCodeExists");

const router = express.Router();

router.post("/register", jwtValidator, newProductRegistration);
router.post("/", jwtValidator, getAllProductsWithPagination);
router.get("/codes", jwtValidator, getAllProductsCodeAsOption);
router.post("/category/id", jwtValidator, getProductByCategoryId);
router.post("/details/id", jwtValidator, getProductDetailsByProductId);
router.put(
  "/update/id",
  jwtValidator,
  updateProduct,
  updateProductDetailInInvoice
);
router.delete("/delete/id", jwtValidator, deleteProduct);
router.get("/itemCode/option", jwtValidator, getAllProductsItemCodeAsOption);
router.post("/option", jwtValidator, getAllProductsAsOption);
router.post("/code/check", jwtValidator, isItemCodeExists);

module.exports = router;
