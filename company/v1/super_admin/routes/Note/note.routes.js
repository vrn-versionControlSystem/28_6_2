const express = require("express");
const {
  getAllNotesWithPagination,
  getAllNotes,
} = require("../../controllers/Note/get.controller");
const {
  getAllConditions,
  getAllConditionsWithPagination,
} = require("../../controllers/poCondition/get.controller");
const {
  deleteMachine,
} = require("../../controllers/machine/machines/delete.controller");
const {
  newNoteRegistration,
} = require("../../controllers/Note/register.controller");
const { updateNote } = require("../../controllers/Note/update.controller");
const {
  updateCondition,
} = require("../../controllers/poCondition/update.controller");
const {
  newConditionRegistration,
} = require("../../controllers/poCondition/register.controller");
const {
  deleteCondition,
} = require("../../controllers/poCondition/Delete.controller");
const {
  updateMachine,
} = require("../../controllers/machine/machines/update.controller");

const jwtValidator = require("../../../../../utils/validators/token.validator");
const { deleteNote } = require("../../controllers/Note/delete.controller");

const router = express.Router();

router.post("/note/register", jwtValidator, newNoteRegistration);
router.post("/note/", jwtValidator, getAllNotesWithPagination);
router.get("/note/all", jwtValidator, getAllNotes);
router.put("/note/update/id", jwtValidator, updateNote);
router.delete("/note/delete/id", jwtValidator, deleteNote);

router.post("/condition/register", jwtValidator, newConditionRegistration);
router.post("/condition/", jwtValidator, getAllConditionsWithPagination);
router.post("/condition/all", jwtValidator, getAllConditions);
router.put("/condition/update/id", jwtValidator, updateCondition);
router.delete("/condition/delete/id", jwtValidator, deleteCondition);
// router.put("/update/id", jwtValidator, updateMachine);

// router.delete("/delete/id", jwtValidator, deleteMachine);

module.exports = router;
