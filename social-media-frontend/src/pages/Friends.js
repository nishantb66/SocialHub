import React, { useState, useEffect } from "react";
import { addFriend, fetchFriends } from "../api";
import { motion } from "framer-motion";

function Friends() {
  const [friendUsername, setFriendUsername] = useState("");
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState("");

  const handleAddFriend = async () => {
    try {
      if (!friendUsername.trim()) {
        setMessage("Please enter a username");
        setTimeout(() => setMessage(""), 2000);
        return;
      }

      const res = await addFriend(friendUsername);
      setMessage(res.data.message);
      setTimeout(() => setMessage(""), 2000);

      // Fetch updated friend list
      loadFriends();
      setFriendUsername(""); // Clear input
    } catch (err) {
      console.error("Error adding friend:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Error adding friend");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const loadFriends = async () => {
    try {
      const res = await fetchFriends();
      setFriends(res.data);
    } catch (err) {
      console.error(
        "Error fetching friends:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-gray-100 font-sans py-10 px-6">
      {/* Header */}
      <motion.h2
        className="text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Friends
      </motion.h2>

      {/* Add Friend Section */}
      <motion.div
        className="max-w-md mx-auto bg-gray-800 shadow-xl rounded-xl p-6 border border-gray-700 mb-10"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter friend's username"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-4 focus:ring-2 focus:ring-green-500 text-gray-300 placeholder-gray-500"
          />
          <motion.button
            onClick={handleAddFriend}
            className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-blue-400 hover:to-green-400 text-white py-2 px-6 rounded-full shadow-lg font-bold uppercase tracking-wide transition-all"
            whileTap={{ scale: 0.95 }}
          >
            Add Friend
          </motion.button>
        </div>
        {message && (
          <motion.p
            className="text-center mt-4 text-green-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>

      {/* Friends List */}
      <motion.div
        className="max-w-lg mx-auto bg-gray-800 shadow-xl rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-3xl font-bold text-gray-100 mb-6 text-center">
          Your Friends
        </h3>
        {friends.length > 0 ? (
          <ul className="space-y-4">
            {friends.map((friend, index) => (
              <li
                key={index}
                className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow-md text-gray-200 flex justify-between items-center"
              >
                <span>{friend.username}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No friends yet.</p>
        )}
      </motion.div>

      {/* Mobile Responsiveness */}
      <style>
        {`
          @media (max-width: 640px) {
            h2 {
              font-size: 2rem;
            }
            h3 {
              font-size: 1.5rem;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Friends;
