const express = require("express");
const route = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const {
  createNew,
  getFullDemo,
  updateRepoWithDes,
  getAll,
  updateStatusRepo,
} = require("../controllers/repositoryController");

route.get("/:userId", authenticateToken, getAll);
route.post("/", authenticateToken, createNew);
route.get("/detail/:id", authenticateToken, getFullDemo);
route.put("/updateDescription/:id", authenticateToken, updateRepoWithDes);
route.put("/updateStatus/:id", authenticateToken, updateStatusRepo);

module.exports = route;
