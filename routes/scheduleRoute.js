const express = require("express");
const router = express.Router();
const {
  addItemToSchedule,
  getScheduleByRepoId,
} = require("../controllers/scheduleController");
const authenticationToken = require("../middlewares/authMiddleware");

router.post("/", authenticationToken, addItemToSchedule);
router.get("/:repoId", authenticationToken, getScheduleByRepoId);

module.exports = router;
