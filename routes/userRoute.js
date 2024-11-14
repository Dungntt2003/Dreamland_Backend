const express = require("express");
const route = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadImg");
const {
  updateUserInfo,
  getUserInfo,
  updateAvatar,
  updatePassword,
} = require("../controllers/userController");

route.get("/:id", authenticateToken, getUserInfo);
route.put("/:id", authenticateToken, updateUserInfo);
route.put("/password/:id", authenticateToken, updatePassword);
route.put("/ava/:id", authenticateToken, upload.single("file"), updateAvatar);

module.exports = route;
