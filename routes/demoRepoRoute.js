const express = require("express");
const router = express.Router();
const authenticationToken = require("../middlewares/authMiddleware");
const { addToRepo } = require("../controllers/demoRepoController");

router.post("/", authenticationToken, addToRepo);

module.exports = router;
