const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const friendsRoutes = require("./routes/friends");
const blogRoutes = require("./routes/blog");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
 // Replace with your frontend URL
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/blogs", blogRoutes);

// Create Server for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

// Handle Socket.io Connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for sendMessage with username and message
  socket.on("sendMessage", (data) => {
    const { username, message } = data;
    io.emit("receiveMessage", { username, message }); // Broadcast the username and message to all users
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
