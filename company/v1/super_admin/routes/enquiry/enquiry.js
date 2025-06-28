const express = require("express");
const {
  newEnquiryRegistration,
} = require("../../controllers/enquiry/register.controller");
const {
  updateEnquiry,
} = require("../../controllers/enquiry/update.controller");

const {
  deleteEnquiry,
} = require("../../controllers/enquiry/delete.controller");

const {
  newEnquiryListRegistration,
} = require("../../controllers/enquiry/enquiryList/register.controller");

const {
  getAllEnquiryListByEnquiryId,
} = require("../../controllers/enquiry/enquiryList/get.controller");

const {
  updateEnquiryList,
} = require("../../controllers/enquiry/enquiryList/update.controller");

const {
  getAllEnquiry,
  getEnquiryById,
} = require("../../controllers/enquiry/get.controller");

const multer = require("multer");
const jwtValidator = require("../../../../../utils/validators/token.validator");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/register",
  jwtValidator,
  newEnquiryRegistration,
  newEnquiryListRegistration
);

router.post("/", jwtValidator, getAllEnquiry);
router.post("/id", jwtValidator, getEnquiryById);

router.post("/list", jwtValidator, getAllEnquiryListByEnquiryId);
router.put("/update", jwtValidator, updateEnquiry, updateEnquiryList);
router.delete("/delete", jwtValidator, deleteEnquiry);

module.exports = router;
