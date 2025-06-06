const express = require("express");
const router = express.Router();
const { getNearbyLocations } = require("../controllers/nearLocationController");

router.get("/", getNearbyLocations);

module.exports = router;
