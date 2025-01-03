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
const userRoutes = require("./routes/user");
const Message = require("./models/Message"); // Import the Message model

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "https://socialhub-frontend.vercel.app" })); // Replace with your frontend URL
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);

// Create Server for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://socialhub-frontend.vercel.app", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

// Active users to handle private chat
const activeUsers = {};

// Handle Socket.io Connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Event: User logs in or becomes active
  socket.on("userOnline", (username) => {
    activeUsers[username] = socket.id; // Map username to socket ID
    console.log(`${username} is now online`);
  });

  // Event: User joins a chat room
  socket.on("joinRoom", ({ senderUsername, recipientUsername }) => {
    const room = [senderUsername, recipientUsername].sort().join("_");

    // Avoid duplicate join notifications by checking if the user is already in the room
    if (!Array.from(socket.rooms).includes(room)) {
      socket.join(room);
      // console.log(`${senderUsername} joined room: ${room}`);

      // Notify the recipient (if online) that the sender has joined
      socket.to(room).emit("userJoined", {
        message: `${senderUsername} has joined the chat.`,
      });
    }
  });

  // Event: Private Chat Message
  socket.on(
    "sendPrivateMessage",
    async ({ senderUsername, recipientUsername, message }) => {
      const room = [senderUsername, recipientUsername].sort().join("_");
      const data = {
        senderUsername,
        recipientUsername,
        message,
        timestamp: new Date(),
      };

      // Emit message to both users in the private room
      io.to(room).emit("receivePrivateMessage", data);

      // Save the message to the database
      const newMessage = new Message({
        sender: senderUsername,
        recipient: recipientUsername,
        message,
      });
      await newMessage.save();

      // Notify recipient if they are online
      if (activeUsers[recipientUsername]) {
        io.to(activeUsers[recipientUsername]).emit(
          "privateMessageNotification",
          {
            senderUsername,
            message: "You have a new message!",
          }
        );
      }
    }
  );

  // Handle user leaving the room
  socket.on("leaveRoom", ({ username, recipientUsername }) => {
    const room = [username, recipientUsername].sort().join("_");

    if (Array.from(socket.rooms).includes(room)) {
      socket.leave(room);
      // console.log(`${username} left room: ${room}`);

      // Notify the other user in the room that the user has left
      socket.to(room).emit("userLeft", {
        message: `${username} has left the chat.`,
      });
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    const disconnectedUser = Object.keys(activeUsers).find(
      (username) => activeUsers[username] === socket.id
    );
    if (disconnectedUser) {
      delete activeUsers[disconnectedUser];
      console.log(`${disconnectedUser} disconnected`);
    }
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
