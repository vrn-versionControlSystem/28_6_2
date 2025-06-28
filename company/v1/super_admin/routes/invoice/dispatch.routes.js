const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const {
  newDispatchConsigneeRegistration,
} = require("../../controllers/invoice/dispatch/consignee/register.controller");
const {
  newDispatchBuyerRegistration,
} = require("../../controllers/invoice/dispatch/buyer/register.controller");
const {
  newDispatchConsigneeAddressRegistration,
} = require("../../controllers/invoice/dispatch/consigneeAddress/register.controller");
const {
  newDispatchShippingAddressRegistration,
} = require("../../controllers/invoice/dispatch/shippingAddress/register.controller");
const {
  newDispatchLocationRegistration,
} = require("../../controllers/invoice/dispatch/location/register.controller");
const {
  newDispatchBoxRegistration,
} = require("../../controllers/invoice/dispatch/box/register.controller");
const {
  newDispatchListRegistration,
} = require("../../controllers/invoice/dispatch/list/register.controller");
const {
  getDispatchForeignInvoiceByDispatchInvoiceId,
  getDispatchDomesticInvoiceByDispatchInvoiceId,
  getAllDispatchInvoiceWithPagination,
  getDispatchDomesticInvoiceByDispatchInvoiceIdTest,
  getAllInvoiceNumber,
  getAllInvoiceDate,
  getUniqueYears,
  getUniqueMonths,
} = require("../../controllers/invoice/dispatch/get.controller");
const {
  newDispatchCompanyDetailsRegistration,
} = require("../../controllers/invoice/dispatch/company/register.controller");
const {
  newDispatchBankDetailsRegistration,
} = require("../../controllers/invoice/dispatch/bank/register.controller");
const {
  newDispatchShippingAndOtherDetailsRegistration,
} = require("../../controllers/invoice/dispatch/shipping_and_other/register.controller");

const {
  updateDispatchShippingAndOtherDetailsRegistration,
} = require("../../controllers/invoice/dispatch/shipping_and_other/update.controller");
const {
  newDispatchShippingDetailsRegistration,
} = require("../../controllers/invoice/dispatch/shipping_details/register.controller");
const {
  newDispatchNoteRegistration,
} = require("../../controllers/invoice/dispatch/note/register.controller");
const {
  newDispatchInvoiceRegistration,
  checkRemainingQuantity,
} = require("../../controllers/invoice/dispatch/register.controller");
const {
  updateDispatchById,
  updateDispatchInvoiceDate,
  updateDispatchInvoiceStatus,
} = require("../../controllers/invoice/dispatch/update.controller");
const {
  CheckInvoiceNumberExists,
} = require("../../controllers/invoice/dispatch/checkInvoiceNumberExists.controller");
const {
  CheckPatternInvoiceNumberExists,
} = require("../../controllers/invoice/dispatch/patternInvoice/CheckInvoiceNumberExistOrNot");
const {
  newPaternInvoiceRegistration,
} = require("../../controllers/invoice/dispatch/patternInvoice/register.controller");
const {
  getAllPatternInvoiceWithPagination,
  getDispatchPatternInvoiceByDispatchInvoiceId,
} = require("../../controllers/invoice/dispatch/patternInvoice/get.controller");
const {
  newPatternDispatchListRegistration,
} = require("../../controllers/invoice/dispatch/patternInvoice/list/register.controller");

const {
  DeleteInvoice,
} = require("../../controllers/invoice/dispatch/delete.controller");
const {
  updatePatternInvoiceListByDispatchListId,
  updatePatternInvoiceStatus,
} = require("../../controllers/invoice/dispatch/patternInvoice/update.controller");
const router = express.Router();

router.post("/details/id", jwtValidator, updateDispatchById);
router.post("/", jwtValidator, getAllDispatchInvoiceWithPagination);
router.post("/pattern/", jwtValidator, getAllPatternInvoiceWithPagination);

router.put(
  "/patternList/id",
  jwtValidator,
  updatePatternInvoiceListByDispatchListId
);

router.post(
  "/foreign/invoice/id",
  jwtValidator,
  getDispatchForeignInvoiceByDispatchInvoiceId
);
router.post(
  "/domestic/invoice/id",
  jwtValidator,
  getDispatchDomesticInvoiceByDispatchInvoiceId
);

router.post(
  "/pattern/invoice/id",
  jwtValidator,
  getDispatchPatternInvoiceByDispatchInvoiceId
);

router.post(
  "/foreign/register",
  jwtValidator,
  // checkRemainingQuantity,
  newDispatchInvoiceRegistration,
  newDispatchConsigneeRegistration,
  newDispatchBuyerRegistration,
  newDispatchConsigneeAddressRegistration,
  newDispatchShippingAddressRegistration,
  newDispatchLocationRegistration,
  newDispatchBoxRegistration,
  newDispatchListRegistration,
  newDispatchCompanyDetailsRegistration,
  newDispatchBankDetailsRegistration,
  newDispatchShippingDetailsRegistration,
  newDispatchNoteRegistration,
  newDispatchShippingAndOtherDetailsRegistration
);

router.post(
  "/pattern/register",
  jwtValidator,
  newPaternInvoiceRegistration,
  newDispatchConsigneeRegistration,
  newDispatchBuyerRegistration,
  newDispatchConsigneeAddressRegistration,
  newDispatchShippingAddressRegistration,
  newPatternDispatchListRegistration,
  newDispatchCompanyDetailsRegistration,
  newDispatchBankDetailsRegistration,
  newDispatchShippingDetailsRegistration,
  newDispatchShippingAndOtherDetailsRegistration
);

router.post(
  "/domestic/register",
  jwtValidator,
  // checkRemainingQuantity,
  newDispatchInvoiceRegistration,
  newDispatchConsigneeRegistration,
  newDispatchBuyerRegistration,
  newDispatchConsigneeAddressRegistration,
  newDispatchShippingAddressRegistration,
  newDispatchLocationRegistration,
  newDispatchListRegistration,
  newDispatchCompanyDetailsRegistration,
  newDispatchBankDetailsRegistration,
  newDispatchShippingAndOtherDetailsRegistration
);

router.put(
  "/foreign/invoice/date/update",
  jwtValidator,
  updateDispatchInvoiceDate
);

router.put(
  "/domestic/packing/update",
  jwtValidator,
  updateDispatchShippingAndOtherDetailsRegistration
);

router.delete("/delete", jwtValidator, DeleteInvoice);

router.post("/check/invoice/number", jwtValidator, CheckInvoiceNumberExists);
router.get("/invoice/number", jwtValidator, getAllInvoiceNumber);
router.get("/invoice/date", jwtValidator, getAllInvoiceDate);
router.get("/invoice/years", jwtValidator, getUniqueYears);
router.get("/invoice/months", jwtValidator, getUniqueMonths);
router.put("/update/status", jwtValidator, updateDispatchInvoiceStatus);

router.put(
  "/patternInvoice/update/status",
  jwtValidator,
  updatePatternInvoiceStatus
);

module.exports = router;
