const express = require("express");
const router = express.Router();
const authenticationToken = require("../middlewares/authMiddleware");
const {
  addToRepo,
  getServicesData,
  removeFromRepo,
} = require("../controllers/demoRepoController");

router.post("/", authenticationToken, addToRepo);
router.delete("/", authenticationToken, removeFromRepo);
router.get("/services/:repoId", authenticationToken, getServicesData);

module.exports = router;
