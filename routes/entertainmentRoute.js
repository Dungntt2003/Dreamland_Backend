const express = require("express");
const route = express.Router();
const upload = require("../middlewares/uploadImg");
const {
  getEnterDetail,
  getListEnters,
  createNewEnter,
} = require("../controllers/entertainmentController");
const authenticateToken = require("../middlewares/authMiddleware");

route.get("/", getListEnters);
route.get("/:id", getEnterDetail);
route.post("/", authenticateToken, upload.array("images", 5), createNewEnter);

module.exports = route;
