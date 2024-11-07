const express = require("express");
const route = express.Router();
const {
  createNewUser,
  testUploadFile,
  test2,
} = require("../controllers/userController");
const upload = require("../middlewares/uploadImg");

route.post("/register", createNewUser);
route.post("/upload", upload.single("file"), testUploadFile);
route.post("/uploads", upload.array("files", 5), test2);

module.exports = route;
