import React, { useEffect, useState } from "react";
import { fetchMyPosts, createPost, searchUserPosts } from "../api";
import Post from "../components/Post";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: "", caption: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [username, setUsername] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showMyPosts, setShowMyPosts] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
    getMyPosts();
  }, []);

  const getMyPosts = async () => {
    try {
      const res = await fetchMyPosts();
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err.response?.data || err.message);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await createPost(newPost);
      setNewPost({ content: "", caption: "" });
      getMyPosts();
      setSuccessMessage("Post created successfully! ✅");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err.response?.data || "Error creating post");
    }
  };

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const res = await searchUserPosts(searchValue);
      setSearchResults(res.data.posts);
    } catch (err) {
      console.error(
        "Error searching user posts:",
        err.response?.data || err.message
      );
      setSearchResults([]);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 font-sans">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-25"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-600 to-green-500 py-6 px-4 md:px-10 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide">
            👀!💻
          </h1>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0">
            <div className="welcome-message">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-wide">
                Welcome, {username || "Guest"}!
              </h2>
            </div>

            <button
              onClick={() => navigate("/friends")}
              className="bg-white text-teal-600 px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform w-full md:w-auto"
            >
              Friends
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="bg-white text-teal-600 px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform w-full md:w-auto"
            >
              Community Chat
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Create Post Section */}
        <motion.div
          className="col-span-1 md:col-span-2 bg-gray-800 rounded-lg p-6 shadow-lg backdrop-blur-md bg-opacity-90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-4">
            Create a Post
          </h2>
          {successMessage && (
            <div className="bg-green-200 text-green-800 py-2 px-4 rounded-md mb-4 text-center">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleCreatePost} className="space-y-4">
            <textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              required
              className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-lg p-4 focus:ring-2 focus:ring-green-400 resize-none"
              rows="4"
            ></textarea>
            <input
              type="text"
              placeholder="Add a caption"
              value={newPost.caption}
              onChange={(e) =>
                setNewPost({ ...newPost, caption: e.target.value })
              }
              className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-lg p-4 focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-teal-400 text-white py-2 px-6 rounded-lg font-bold shadow hover:scale-105 transition-transform w-full md:w-auto"
            >
              Post
            </button>
          </form>
        </motion.div>

        {/* Search Section */}
        <motion.div
          className="col-span-1 bg-gray-800 rounded-lg p-6 shadow-lg backdrop-blur-md bg-opacity-90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-4">
            Search Posts
          </h2>
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-lg p-4 focus:ring-2 focus:ring-green-400"
          />
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-green-400 mb-2">
                Results for "{searchTerm}"
              </h3>
              <ul className="space-y-4">
                {searchResults.map((post) => (
                  <li
                    key={post._id}
                    className="bg-gray-700 p-4 rounded-lg shadow"
                  >
                    <Post post={post} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>

      {/* My Posts Section */}
      <div className="max-w-7xl mx-auto py-6 px-4">
        <button
          onClick={() => setShowMyPosts(!showMyPosts)}
          className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-6 py-3 rounded-lg shadow hover:scale-105 transition-transform w-full md:w-auto"
        >
          {showMyPosts ? "Hide My Posts" : "Show My Posts"}
        </button>

        {showMyPosts && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-gray-800 p-6 rounded-lg shadow hover:scale-105 transition-transform"
                >
                  <Post post={post} />
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No posts available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

