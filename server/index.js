const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const { Readable } = require("stream");
require("dotenv").config();

// Initialize OpenAI API client with the provided API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create an instance of an Express app
const app = express();
app.use(express.json());
app.use(cors());
const port = 3001; // Backend will run on port 3001

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("Hello! This is the backend for your virtual assistant.");
});

// Define a POST route to handle chat messages from the frontend
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).send({ error: "Message is required" });
  }

  try {
    // Prepare messages for the chatbot
    const messages = [
      {
        role: "system",
        content:
          "You are a virtual assistant providing helpful and concise responses.",
      },
      { role: "user", content: userMessage },
    ];

    // Send messages to the OpenAI API and get the response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });

    // Extract the chatbot's response
    const assistantMessage = completion.choices[0].message.content;

    // Convert the chatbot response to speech
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "echo",
      input: assistantMessage,
    });

    // Convert the audio to base64
    const audioBuffer = Buffer.from(await mp3.arrayBuffer());
    const audioBase64 = audioBuffer.toString("base64");

    // Send the response back to the frontend
    res.send({
      messages: [{ text: assistantMessage }],
      audio: audioBase64, // Send the base64-encoded audio data
    });
  } catch (error) {
    console.error("Error handling /chat:", error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request" });
  }
});

// Start the backend server
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
