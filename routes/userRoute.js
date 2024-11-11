const express = require("express");
const route = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const {
  updateUserInfo,
  getUserInfo,
} = require("../controllers/userController");

route.get("/:id", authenticateToken, getUserInfo);
route.put("/:id", authenticateToken, updateUserInfo);

module.exports = route;
