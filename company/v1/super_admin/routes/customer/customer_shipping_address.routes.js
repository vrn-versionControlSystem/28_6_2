const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const {
  customerNewShippingAddressRegistration,
} = require("../../controllers/customer/shipping/shipping_address/register.controller");
const {
  getCustomerShippingAddressByCustomerId,
} = require("../../controllers/customer/shipping/shipping_address/get.controller");
const {
  updateCustomerShippingAddressRegistration,
} = require("../../controllers/customer/shipping/shipping_address/update.controller");
const {
  deleteCustomerShippingAddress,
} = require("../../controllers/customer/shipping/shipping_address/delete.contoller");
const router = express.Router();

router.post("/register", jwtValidator, customerNewShippingAddressRegistration);
router.post(
  "/select/customer/id",
  jwtValidator,
  getCustomerShippingAddressByCustomerId
);
router.put("/update", jwtValidator, updateCustomerShippingAddressRegistration);
router.delete("/delete", jwtValidator, deleteCustomerShippingAddress);
// router.get("/select", jwtValidator, getAllCustomers);

module.exports = router;
