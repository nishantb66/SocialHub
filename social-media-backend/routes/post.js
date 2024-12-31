const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE POST
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { content, caption } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = new Post({
      userId: req.user._id,
      content,
      caption,
    });

    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error creating post", error: err.message });
  }
});

// GET POSTS FOR LOGGED-IN USER (USER DASHBOARD)
router.get("/my-posts", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching posts", error: err.message });
  }
});

// SEARCH USER AND FETCH THEIR POSTS
router.get("/user/:username", authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch posts by the user
    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ user, posts });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching user posts", error: err.message });
  }
});

// LIKE A POST
router.put("/:postId/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id); // Add userId to likes array
      await post.save();
      return res.status(200).json({ message: "Post liked", post });
    } else {
      return res.status(400).json({ message: "You already liked this post" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error liking post", error: err.message });
  }
});

// UNLIKE A POST
router.put("/:postId/unlike", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter((like) => like.toString() !== req.user._id.toString()); // Remove userId from likes array
      await post.save();
      return res.status(200).json({ message: "Post unliked", post });
    } else {
      return res.status(400).json({ message: "You haven't liked this post" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error unliking post", error: err.message });
  }
});

// Add a Comment to a Post
router.post("/:postId/comment", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      userId: req.user._id,
      text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get Comments for a Post
router.get("/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate(
      "comments.userId",
      "username"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post.comments);
  } catch (err) {
    console.error("Error fetching comments:", err.message || err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
