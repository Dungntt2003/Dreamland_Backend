const express = require("express");
const router = express.Router();
const { requestAI, integrateLLM } = require("../controllers/aiController");

router.post("/ask-ai", requestAI);
router.post("/integrate-llm", integrateLLM);

module.exports = router;
