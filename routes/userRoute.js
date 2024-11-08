const express = require("express");
const route = express.Router();
const { createNewUser, checkLogin } = require("../controllers/userController");
const upload = require("../middlewares/uploadImg");

const uploadFields = upload.fields([
  { name: "front_image", maxCount: 1 },
  { name: "back_image", maxCount: 1 },
  { name: "ava", maxCount: 1 },
]);

route.post("/register", uploadFields, createNewUser);
route.post("/login", checkLogin);
module.exports = route;
