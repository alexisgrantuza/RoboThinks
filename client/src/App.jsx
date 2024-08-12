import React, { useState, useEffect } from "react";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [audioUrl, setAudioUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/chat", {
        message: message,
      });

      const { messages, audio: audioBase64 } = response.data;
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0))],
        { type: "audio/mp3" }
      );
      const audioUrl = URL.createObjectURL(audioBlob);

      // Update the chat history with both user input and assistant response
      setChatHistory([
        ...chatHistory,
        {
          user: message,
          assistant: [{ text: messages[0].text }],
        },
      ]);

      setAudioUrl(audioUrl);
      setMessage(""); // Clear the text input
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio
        .play()
        .catch((error) => console.error("Audio playback error:", error));
    }
  }, [audioUrl]);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div
        id="chatbox"
        className="h-80 overflow-y-auto border border-gray-300 p-4 mb-4"
      >
        <div className="space-y-4 mb-6">
          {chatHistory.map((response, index) => (
            <div key={index} className="space-y-2">
              <p className="text-gray-800">
                <strong>You:</strong> {response.user}
              </p>
              {response.assistant.map((msg, i) => (
                <p key={i} className="text-gray-600">
                  <strong>Assistant:</strong> {msg.text}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-lg"
          placeholder="Type your message here"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
