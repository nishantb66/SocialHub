const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/search", async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ message: "Username required" });

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ username: user.username });
});

module.exports = router;
