const express = require("express");
const jwtValidator = require("../../../../utils/validators/token.validator");
const {
  newUserRegistration,
} = require("../controllers/user/register.controller");
const { deleteUser } = require("../controllers/user/delete.controller");
const {
  updateUser,
  updateUserPassword,
} = require("../controllers/user/update.controller");
const {
  getAllUsersOfIndividualCompanyWithPagination,
  getAllUsersASOption,
  getPasswordOfUser,
} = require("../controllers/user/get.controller");
const router = express.Router();

router.post("/register", jwtValidator, newUserRegistration);
router.post("/", jwtValidator, getAllUsersOfIndividualCompanyWithPagination);
router.delete("/delete/id", jwtValidator, deleteUser);
router.put("/update/id", jwtValidator, updateUser);
router.put("/update/password", jwtValidator, updateUserPassword);
router.post("/option", jwtValidator, getAllUsersASOption);
router.post("/get/password", jwtValidator, getPasswordOfUser);

module.exports = router;
