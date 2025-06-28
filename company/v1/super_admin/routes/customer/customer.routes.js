const express = require("express");
const {
  newCustomerRegistration,
} = require("../../controllers/customer/register.controller");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const {
  customerNewPermanentAddressRegistration,
} = require("../../controllers/customer/permanent_address/register.controller");
const {
  UpdateCustomer,
} = require("../../controllers/customer/update.controller");
const {
  updatecustomerNewPermanentAddressRegistration,
} = require("../../controllers/customer/permanent_address/update.controller");
const {
  getAllCustomersWithPagination,
  getAllCustomers,
  getCustomerDetailsByCustomerId,
  getAllCustomersOption,
} = require("../../controllers/customer/get.controller");
const {
  deleteCustomer,
} = require("../../controllers/customer/delete.controller");
const router = express.Router();

router.post(
  "/register",
  jwtValidator,
  newCustomerRegistration,
  customerNewPermanentAddressRegistration
);
router.post("/", jwtValidator, getAllCustomersWithPagination);
router.get("/select", jwtValidator, getAllCustomers);
router.get("/option", jwtValidator, getAllCustomersOption);
router.post("/details/id", jwtValidator, getCustomerDetailsByCustomerId);
router.put(
  "/update/id",
  jwtValidator,
  UpdateCustomer,
  updatecustomerNewPermanentAddressRegistration
);
router.delete("/delete/id", jwtValidator, deleteCustomer);

module.exports = router;
