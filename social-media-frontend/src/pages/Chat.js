import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("https://socialhub-backend-3j7g.onrender.com"); // Replace with your backend URL

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem("username") || "Guest"; // Retrieve the username from localStorage or default to 'Guest'

  const chatEndRef = useRef(null); // Ref to track the end of the chat container

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup on unmount
    return () => socket.off("receiveMessage");
  }, []);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { username, message }); // Send username and message to the server
      setMessage(""); // Clear input field
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br bg-gray-900 via-gray-900 to-black text-gray-100">
      <div className="w-full max-w-4xl bg-gray-900 shadow-xl rounded-lg p-8 relative">
        <div className="absolute top-4 right-4 text-gray-500 text-sm font-medium">
          Logged in as: <span className="text-green-400">{username}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-green-600 text-center mb-6">
        Grab a cup of coffee and start chatting 
        </h1>

        {/* Chat Messages */}
        <div className="chat-box border border-gray-700 rounded-lg p-4 bg-gray-800 h-96 overflow-y-scroll custom-scrollbar shadow-inner">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 text-lg animate-pulse">
              Be the first to start the conversation!
            </p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 mb-3 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
                  msg.username === username
                    ? "bg-green-600 text-white text-right ml-auto"
                    : "bg-gray-700 text-gray-300 text-left mr-auto"
                } max-w-sm`}
              >
                <span className="block font-semibold text-sm text-gray-200">
                  {msg.username === username ? "You" : msg.username}
                </span>
                <span className="block text-sm text-gray-100">
                  {msg.message}
                </span>
              </div>
            ))
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Section */}
        <div className="mt-6 flex space-x-4 items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow border border-gray-700 bg-gray-800 text-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 transition-shadow shadow-lg"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-green-500 to-teal-400 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transform transition-transform duration-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
