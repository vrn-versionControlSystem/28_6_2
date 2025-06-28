const express = require("express");
const {
  newTaskRegistration,
} = require("../../controllers/task/register.controller");
const { getAllTasks } = require("../../controllers/task/get.controller");
const { updateTask } = require("../../controllers/task/update.controller");
const { deleteTask } = require("../../controllers/task/delete.controller");

const {
  newChatRegistration,
} = require("../../controllers/task/taskChat/register.controller");
const {
  getAllChatsByTaskID,
  checkUserIsOnlineOrNot,
} = require("../../controllers/task/taskChat/get.controller");
const jwtValidator = require("../../../../../utils/validators/token.validator");

const router = express.Router();

router.post("/", jwtValidator, getAllTasks);
router.post("/register", jwtValidator, newTaskRegistration);
router.put("/update/id", jwtValidator, updateTask);
router.delete("/delete/id", jwtValidator, deleteTask);

//CHAT ROUTES
router.post("/chat/register", jwtValidator, newChatRegistration);
router.post("/chat", jwtValidator, getAllChatsByTaskID);
router.post("/user/status", jwtValidator, checkUserIsOnlineOrNot);
module.exports = router;
