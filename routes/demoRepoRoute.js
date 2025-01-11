const express = require("express");
const router = express.Router();
const authenticationToken = require("../middlewares/authMiddleware");
const {
  addToRepo,
  getServicesData,
} = require("../controllers/demoRepoController");

router.post("/", authenticationToken, addToRepo);
router.get("/services/:repoId", authenticationToken, getServicesData);

module.exports = router;
