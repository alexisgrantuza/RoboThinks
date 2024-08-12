import React, { useState } from "react";
import axios from "axios";

function App() {
  const [inputText, setInputText] = useState("");
  const [responses, setResponses] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const response = await axios.post("http://localhost:3001/chat", {
        message: inputText,
      });

      setResponses((prev) => [
        ...prev,
        { user: inputText, assistant: response.data.messages },
      ]);
      setInputText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Virtual Assistant
        </h1>
        <div className="space-y-4 mb-6">
          {responses.map((response, index) => (
            <div key={index}>
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
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
