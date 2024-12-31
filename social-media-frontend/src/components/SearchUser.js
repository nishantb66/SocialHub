import React, { useState } from "react";
import { searchUserPosts } from "../api"; // API call to fetch user's posts
import Post from "./Post";

function SearchUser() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await searchUserPosts(username);
      setUserData(res.data);
    } catch (err) {
      alert("User not found");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Search User</h3>
      <div>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button onClick={handleSearch} style={{ padding: "5px 10px" }}>
          Search
        </button>
      </div>

      {/* Display searched user's posts */}
      {userData && (
        <div>
          <h4>Posts by {userData.user.username}</h4>
          {userData.posts.length > 0 ? (
            userData.posts.map((post) => <Post key={post._id} post={post} />)
          ) : (
            <p>No posts available for this user.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchUser;
