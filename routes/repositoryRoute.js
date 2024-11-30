const express = require("express");
const route = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const {
  createNew,
  getFullDemo,
} = require("../controllers/repositoryController");

route.post("/", authenticateToken, createNew);
route.get("/:id", authenticateToken, getFullDemo);

module.exports = route;
