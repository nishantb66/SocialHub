const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add Friend Route
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { friendUsername } = req.body;

    if (!friendUsername) {
      return res.status(400).json({ message: "Friend username is required" });
    }

    // Find friend user by username
    const friend = await User.findOne({ username: friendUsername });
    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find current logged-in user
    const currentUser = await User.findById(req.user._id);

    // Check if the friend is already added
    if (currentUser.friends && currentUser.friends.includes(friend._id)) {
      return res.status(400).json({ message: "User is already your friend" });
    }

    // Add friend to user's friend list
    currentUser.friends = currentUser.friends || [];
    currentUser.friends.push(friend._id);
    await currentUser.save();

    res.status(200).json({ message: "Addded✅" });
  } catch (err) {
    console.error("Error adding friend:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Friends List Route
router.get("/", authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).populate(
      "friends",
      "username"
    );
    res.status(200).json(currentUser.friends);
  } catch (err) {
    console.error("Error fetching friends:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
