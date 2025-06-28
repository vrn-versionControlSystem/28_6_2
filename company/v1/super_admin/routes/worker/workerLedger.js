const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const {
  fetchAllLedgerByWorkerIdAndAuthority,
} = require("../../../../../company/v1/super_admin/controllers/worker/workerLedger/fetch");
const {
  registerWorkerLedgerByAmountDebit,
} = require("../../../../../company/v1/super_admin/controllers/worker/workerLedger/register");
const router = express.Router();

router.post("/", jwtValidator, fetchAllLedgerByWorkerIdAndAuthority);

router.post("/pay", jwtValidator, registerWorkerLedgerByAmountDebit);
module.exports = router;
