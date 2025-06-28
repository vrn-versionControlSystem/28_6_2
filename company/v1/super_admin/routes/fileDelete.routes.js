const express = require("express");
const jwtValidator = require("../../../../utils/validators/token.validator");
const {
  deleteAnyFile,
} = require("../controllers/DeleteFile/delete.controller");

const router = express.Router();

router.delete("/delete", jwtValidator, deleteAnyFile);

module.exports = router;
