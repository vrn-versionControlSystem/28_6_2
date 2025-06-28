const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const { newStockRegistration } = require("../../controllers/stock/register");
const {
  getAllStock,
  getAllStockData,
} = require("../../controllers/stock/fetch");

const {
  updateStockDetailsByStockId,
} = require("../../controllers//stock/update");
const { deleteStockByStockId } = require("../../controllers/stock/delete");
const router = express.Router();

//isDepartmentExistsById, isDepartmentDeleted,

router.post("/register", jwtValidator, newStockRegistration);
router.get("/", jwtValidator, getAllStock);
router.get("/data", jwtValidator, getAllStockData);
router.put("/update/id", jwtValidator, updateStockDetailsByStockId);
router.delete("/delete/id", jwtValidator, deleteStockByStockId);
module.exports = router;
