const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const {
  WorkerAttendanceRegistration,
} = require("../../controllers/workerAttendance/register");
const {
  getWorkerAttendanceById,
} = require("../../controllers/workerAttendance/fetch");
const {
  getTotalAttendanceById,
} = require("../../controllers/workerAttendance/totalAttendance");
const {
  getMonthlyAttendanceById,
} = require("../../controllers/workerAttendance/monthlyAttendance");

const router = express.Router();

router.post("/register/id", jwtValidator, WorkerAttendanceRegistration);
router.post("/id", jwtValidator, getWorkerAttendanceById);
router.post("/total/id", jwtValidator, getTotalAttendanceById);
router.post("/monthly/id", jwtValidator, getMonthlyAttendanceById);
module.exports = router;
