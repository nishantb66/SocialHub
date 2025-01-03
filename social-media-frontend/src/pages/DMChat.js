import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("https://socialhub-backend-3j7g.onrender.com"); // Replace with your backend URL

function DMChat() {
  const { recipientUsername } = useParams(); // Get recipient username from URL
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const senderUsername = localStorage.getItem("username") || "Guest"; // Sender's username
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.emit("joinRoom", { senderUsername, recipientUsername });

    socket.on("userJoined", (data) => {
      alert(data.message); // Notify the user
    });

    socket.on("userLeft", (data) => {
      alert(data.message); // Notify the user
    });

    socket.on("receivePrivateMessage", (data) => {
      if (data.senderUsername !== senderUsername) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.emit("leaveRoom", { username: senderUsername, recipientUsername });
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("receivePrivateMessage");
    };
  }, [senderUsername, recipientUsername]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const data = { senderUsername, recipientUsername, message };
      setMessages((prevMessages) => [...prevMessages, data]); // Add the message locally
      socket.emit("sendPrivateMessage", data); // Emit the message to the server
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <header className="py-4 px-4 bg-green-600 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Chat with {recipientUsername}
        </h1>
      </header>
      <main className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 my-2 rounded-lg max-w-xs md:max-w-md ${
              msg.senderUsername === senderUsername
                ? "bg-green-600 text-white self-end ml-auto"
                : "bg-gray-700 text-gray-300 mr-auto"
            }`}
          >
            <p className="font-bold text-sm sm:text-base">
              {msg.senderUsername}
            </p>
            <p className="text-sm sm:text-base">{msg.message}</p>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </main>
      <footer className="p-4 bg-gray-800 flex gap-2 items-center">
        <input
          type="text"
          className="flex-grow bg-gray-700 text-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Send
        </button>
      </footer>
    </div>
  );
}

export default DMChat;
