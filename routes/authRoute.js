const express = require("express");
const route = express.Router();
const { createNewUser, checkLogin } = require("../controllers/authController");
const upload = require("../middlewares/uploadImg");
const authenticateToken = require("../middlewares/authMiddleware");
const uploadFields = upload.fields([
  { name: "front_image", maxCount: 1 },
  { name: "back_image", maxCount: 1 },
  { name: "ava", maxCount: 1 },
]);

route.post("/register", uploadFields, createNewUser);
route.post("/login", checkLogin);

route.get("/", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Protected route", userId: req.user.id });
});
module.exports = route;
