const express = require("express");
const route = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const {
  createNew,
  getFullDemo,
  updateRepoWithDes,
} = require("../controllers/repositoryController");

route.post("/", authenticateToken, createNew);
route.get("/:id", authenticateToken, getFullDemo);
route.put("/updateDescription/:id", authenticateToken, updateRepoWithDes);

module.exports = route;
