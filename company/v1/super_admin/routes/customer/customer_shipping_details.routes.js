const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const {
  customerNewShippingDetailsRegistration,
} = require("../../controllers/customer/shipping/shipping_details/register.controller");
const {
  getCustomerShippingDetailsByCustomerId,
} = require("../../controllers/customer/shipping/shipping_details/get.controller");
const {
  updatecustomerShippingDetails,
} = require("../../controllers/customer/shipping/shipping_details/update.controller");
const {
  deletecustomerShippingDetails,
} = require("../../controllers/customer/shipping/shipping_details/delete.controller");
const router = express.Router();

router.post("/register", jwtValidator, customerNewShippingDetailsRegistration);
router.post(
  "/select/customer/id",
  jwtValidator,
  getCustomerShippingDetailsByCustomerId
);
router.put("/update", jwtValidator, updatecustomerShippingDetails);
router.delete("/delete", jwtValidator, deletecustomerShippingDetails);
// router.get("/select", jwtValidator, getAllCustomers);

module.exports = router;
