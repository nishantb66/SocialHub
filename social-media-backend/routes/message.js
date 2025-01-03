const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// Fetch unread messages for a user
router.get("/unread", async (req, res) => {
  const { username } = req.query;

  try {
    const unreadMessages = await Message.find({
      recipient: username,
      isRead: false,
    });
    res.status(200).json(unreadMessages);
  } catch (error) {
    console.error("Error fetching unread messages:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark messages as read
router.put("/mark-read", async (req, res) => {
  const { messageIds } = req.body;

  try {
    await Message.updateMany({ _id: { $in: messageIds } }, { isRead: true });
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
