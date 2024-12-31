import React, { useState } from "react";
import axios from "axios";

function CreatePost({ fetchPosts }) {
  const [content, setContent] = useState("");
  const [caption, setCaption] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/posts",
        { content, caption },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Post created successfully!");
      setContent("");
      setCaption("");
      fetchPosts(); // Refresh posts on success
    } catch (err) {
      console.error(err.response?.data || "Error creating post");
      alert("Failed to create post.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <textarea
        placeholder="Write your post here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows="3"
        style={{ width: "100%", marginBottom: "10px" }}
      ></textarea>
      <input
        type="text"
        placeholder="Add a caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button type="submit">Create Post</button>
    </form>
  );
}

export default CreatePost;
