import React, { useState, useEffect } from "react";
import { createBlog, fetchAllBlogs, fetchMyBlogs } from "../api";
import { motion } from "framer-motion";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    loadBlogs();
    loadMyBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const res = await fetchAllBlogs();
      setBlogs(res.data);
      setFilteredBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err.message);
    }
  };

  const loadMyBlogs = async () => {
    try {
      const res = await fetchMyBlogs();
      setMyBlogs(res.data);
    } catch (err) {
      console.error("Error fetching my blogs:", err.message);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredBlogs(blogs);
      return;
    }

    const matchingBlogs = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(value.toLowerCase()) ||
        blog.content.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBlogs(matchingBlogs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBlog(formData);
      setMessage("Blog created successfully! ✅");
      setFormData({ title: "", content: "" });
      loadBlogs();
      loadMyBlogs();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error creating blog:", err.message);
      setMessage("Failed to create blog ❌");
    }
  };

  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
  };

  const closeBlogModal = () => {
    setSelectedBlog(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-sans relative">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          BloG
        </motion.h1>

        {message && (
          <motion.div
            className={`${
              message.includes("✅")
                ? "bg-green-800 text-green-200"
                : "bg-red-800 text-red-200"
            } py-3 px-5 rounded-lg shadow-md mb-8 text-center`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.div>
        )}

        {/* Blog Creation */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-gray-800 shadow-2xl rounded-3xl p-6 sm:p-8 mb-12 border border-gray-700 relative backdrop-blur-md bg-opacity-70"
          whileHover={{ scale: 1.01 }}
        >
          <div className="absolute -left-6 sm:-left-10 top-4 text-gray-400 text-4xl sm:text-6xl font-bold">
            ✍🏻
          </div>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="w-full bg-gray-900 border-none p-3 sm:p-4 mb-4 text-2xl sm:text-4xl font-bold text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-0"
          />
          <textarea
            placeholder="Tell your story..."
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            required
            className="w-full bg-gray-900 border-none p-3 sm:p-4 mb-4 text-lg sm:text-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-0 resize-none h-48 sm:h-64"
          ></textarea>
          <motion.button
            type="submit"
            className="absolute top-4 right-4 bg-green-500 hover:bg-green-400 text-white py-2 px-4 sm:px-6 rounded-full font-semibold"
            whileTap={{ scale: 0.95 }}
          >
            Publish
          </motion.button>
        </motion.form>

        {/* Search Bar */}
        <motion.div className="relative mb-12" whileHover={{ scale: 1.02 }}>
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4 focus:ring-2 focus:ring-green-400 text-gray-200 shadow-md"
          />
        </motion.div>

        {/* My Blogs */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 mb-6">
            My Blogs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-gray-800 shadow-lg rounded-3xl p-4 sm:p-6 hover:shadow-xl transition-transform hover:scale-105 border border-gray-700 cursor-pointer"
                onClick={() => openBlogModal(blog)}
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">
                  {blog.title}
                </h3>
                <p
                  className="text-gray-400 line-clamp-3"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {blog.content}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* All Blogs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 mb-6">
            Community Blogs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-gray-800 shadow-lg rounded-3xl p-4 sm:p-6 hover:shadow-xl transition-transform hover:scale-105 border border-gray-700 cursor-pointer"
                onClick={() => openBlogModal(blog)}
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">
                  {blog.title}
                </h3>
                <p
                  className="text-gray-400 line-clamp-3"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {blog.content}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  By: {blog.userId.username}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 px-4">
          <div className="bg-gray-800 rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeBlogModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 text-lg sm:text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 mb-4">
              {selectedBlog.title}
            </h2>
            <p
              className="text-gray-400 mb-4"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {selectedBlog.content}
            </p>
            <p className="text-sm text-gray-500">
              By: {selectedBlog.userId.username}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blogs;

