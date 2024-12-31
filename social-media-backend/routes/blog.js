const express = require("express");
const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Create a Blog
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }
    const blog = new Blog({ userId: req.user._id, title, content });
    await blog.save();
    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (err) {
    console.error("Error creating blog:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch All Blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("userId", "username")
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch Blogs by Logged-in User
router.get("/my-blogs", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(blogs);
  } catch (err) {
    console.error("Error fetching user's blogs:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
