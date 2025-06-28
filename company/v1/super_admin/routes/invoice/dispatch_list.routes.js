const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const {
  updateDispatchListByDispatchListId,
  updateRawMachiningDataDispatchById,
} = require("../../controllers/invoice/dispatch/list/update.controller");
const {
  deleteDispatchListByDispatchListId,
} = require("../../controllers/invoice/dispatch/list/delete.controller");

const {
  checkRemainingQuantityProductAdd,
} = require("../../controllers/invoice/dispatch/register.controller");
const {
  updateDispatchListByAddItem,
} = require("../../controllers/invoice/dispatch/list/update.controller");

const {
  newDispatchBoxRegistrationInvoiceEdit,
} = require("../../controllers/invoice/dispatch/box/register.controller");
const {
  deleteDispatchBoxInvoice,
} = require("../../controllers/invoice/dispatch/box/delete.controller");

const {
  updateBoxDetails,
} = require("../../controllers/invoice/dispatch/box/update.controller");

const router = express.Router();

router.put("/id", jwtValidator, updateDispatchListByDispatchListId);
router.delete("/delete/id", jwtValidator, deleteDispatchListByDispatchListId);

router.post(
  "/raw/machining/date",
  jwtValidator,
  updateRawMachiningDataDispatchById
);

router.post(
  "/add/product",
  jwtValidator,
  // checkRemainingQuantityProductAdd,
  updateDispatchListByAddItem
);

router.post("/add/box", jwtValidator, newDispatchBoxRegistrationInvoiceEdit);
router.delete("/delete/box", jwtValidator, deleteDispatchBoxInvoice);
router.put("/update/box", jwtValidator, updateBoxDetails);

module.exports = router;
