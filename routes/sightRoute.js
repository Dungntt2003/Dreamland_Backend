const express = require("express");
const route = express.Router();
const upload = require("../middlewares/uploadImg");
const {
  createSight,
  getListSights,
  getSightDetail,
} = require("../controllers/sightController");
const authenticateToken = require("../middlewares/authMiddleware");

route.get("/", getListSights);
route.get("/:id", getSightDetail);
route.post("/", authenticateToken, upload.array("images", 5), createSight);

module.exports = route;
