const express = require("express");
const {
  isPasswordValid,
  getUserByEmail,
  refreshToken,
} = require("../../common/controllers/auth/login");
const router = express.Router();

router.post("/login", getUserByEmail, isPasswordValid);
router.post("/refresh", refreshToken);

module.exports = router;
