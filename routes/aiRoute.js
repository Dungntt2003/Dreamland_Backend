const express = require("express");
const router = express.Router();
const { requestAI } = require("../controllers/aiController");

router.post("/ask-ai", requestAI);

module.exports = router;
