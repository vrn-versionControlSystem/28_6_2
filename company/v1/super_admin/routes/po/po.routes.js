const express = require("express");
const {
  newPoRegistration,
} = require("../../controllers/po/register.controller");
const { isPoNumberExists } = require("../../controllers/po/isPoNumberExists");

const { DeletePo } = require("../../controllers/po/delete.controller");

const { updatePoByPoId } = require("../../controllers/po/update.controller");
const {
  updatePoListByPoListIdData,
} = require("../../controllers/po/po_list/update.controller");
const {
  updateDispatchListWhenPOisUpdated,
} = require("../../controllers/invoice/dispatch/list/update.controller");
const {
  newPoListRegistration,
} = require("../../controllers/po/po_list/register.controller");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const {
  getAllPoWithPagination,
  getAllPosByCustomerId,
  getPoDetailsByPoId,
  getAllPoProducts,
  getAllPoNumberByCustomerId,
  getUniquePONumber,
  getPODates,
  geAllPoDeliveryDates,
  geAllBrotherConfirmDate,
  geAllRawDate,
  geAllMachiningDate,
  getAllPoNumberASOption,
  getAllPOAASOption,
  getUniquePOYears,
  getUniquePOMonths,
  getUniquePODateFromYearAndMonth,
} = require("../../controllers/po/get.controller");
const router = express.Router();

router.post(
  "/register",
  jwtValidator,
  newPoRegistration,
  newPoListRegistration
);
router.post("/", jwtValidator, getAllPoWithPagination);
router.post("/select/customer/id", jwtValidator, getAllPosByCustomerId);
router.post("/id", jwtValidator, getPoDetailsByPoId);

router.post(
  "/update/id",
  jwtValidator,
  updatePoByPoId,
  updatePoListByPoListIdData,
  updateDispatchListWhenPOisUpdated
);

http: router.delete("/delete/id", jwtValidator, DeletePo);
router.post("/number/po", jwtValidator, getAllPoNumberByCustomerId);
router.get("/lists", jwtValidator, getAllPoProducts);
router.get("/Unique/number", jwtValidator, getUniquePONumber);
router.post("/dates", jwtValidator, getPODates);
router.post("/delivery/dates", jwtValidator, geAllPoDeliveryDates);
router.post("/accept/delivery/dates", jwtValidator, geAllBrotherConfirmDate);
router.post("/raw/dates", jwtValidator, geAllRawDate);
router.post("/machining/dates", jwtValidator, geAllMachiningDate);
router.post("/Number/Check", jwtValidator, isPoNumberExists);
router.post("/Number/po/option", jwtValidator, getAllPoNumberASOption);
router.post("/poa/option", jwtValidator, getAllPOAASOption);
router.get("/years", jwtValidator, getUniquePOYears);
router.post("/months", jwtValidator, getUniquePOMonths);
router.post("/month/dates", jwtValidator, getUniquePODateFromYearAndMonth);

module.exports = router;
