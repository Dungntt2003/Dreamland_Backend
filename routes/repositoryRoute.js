const express = require("express");
const route = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const {
  createNew,
  getFullDemo,
  updateRepoWithDes,
  getAll,
} = require("../controllers/repositoryController");

route.get("/:userId", authenticateToken, getAll);
route.post("/", authenticateToken, createNew);
route.get("/:id", authenticateToken, getFullDemo);
route.put("/updateDescription/:id", authenticateToken, updateRepoWithDes);

module.exports = route;
