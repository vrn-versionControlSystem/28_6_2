const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const { newWorkerRegistration } = require("../../controllers/worker/register");
const {
  getAllWorker,
  getWorkerById,
} = require("../../controllers/worker/fetch");
const {
  isWorkerExistsById,
} = require("../../controllers/worker/isWorkerExistById");
const { isWorkerDeleted } = require("../../controllers/worker/isWorkerDeleted");
const {
  updateWorkerDetailsByWorkerId,
} = require("../../controllers/worker/update");
const { deletedWorkerByWorkerId } = require("../../controllers/worker/delete");
const router = express.Router();

//isDepartmentExistsById, isDepartmentDeleted,

router.post("/register", jwtValidator, newWorkerRegistration);
router.get("/", jwtValidator, getAllWorker);
router.post("/id", jwtValidator, getWorkerById);
router.put(
  "/update/id",
  jwtValidator,
  isWorkerExistsById,
  isWorkerDeleted,
  updateWorkerDetailsByWorkerId
);
router.delete(
  "/delete/id",
  jwtValidator,
  isWorkerExistsById,
  isWorkerDeleted,
  deletedWorkerByWorkerId
);
module.exports = router;
