const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Hugging Face model (can be Mistral, Falcon, Llama, etc.)
const HUGGINGFACE_API = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";

// === Chatbot Endpoint ===
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await axios.post(
      HUGGINGFACE_API,
      {
        inputs: `You are a supportive mental health assistant. Respond compassionately to:\n\n${message}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const reply = response.data[0]?.generated_text || "I'm here for you.";
    res.json({ reply });
  } catch (error) {
    console.error("Chatbot API error:", error.message);
    res.status(500).json({ error: "Failed to get a response from Hugging Face." });
  }
});

// === Server Start ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🟢 MindMosaic server running on port ${PORT}`));
