require("dotenv").config();
const axios = require("axios");
const requestAI = async (req, res) => {
  const { question } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // Optional (điền URL web của bạn nếu muốn show trên openrouter.ai)
          "X-Title": "Dreamland Travel Assistant", // Optional (tiêu đề app)
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;
    res.status(200).json({ reply: aiReply });
  } catch (error) {
    console.error(
      "Error from OpenRouter:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
};

module.exports = { requestAI };
