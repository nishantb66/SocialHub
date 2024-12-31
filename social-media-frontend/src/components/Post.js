import React, { useState, useEffect, useCallback } from "react";
import { likePost, unlikePost, addComment, fetchComments } from "../api";
import { io } from "socket.io-client";

// Establish socket connection
const socket = io("http://localhost:5000");

function Post({ post, onNotification }) {
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(
    post.likes.includes(localStorage.getItem("userId"))
  );
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const loggedInUserId = localStorage.getItem("userId");

  const loadComments = useCallback(async () => {
    setIsLoadingComments(true);
    try {
      const res = await fetchComments(post._id);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err.message);
    } finally {
      setIsLoadingComments(false);
    }
  }, [post._id]);

  const handleLike = async () => {
    try {
      await likePost(post._id);
      setLikesCount((prev) => prev + 1);
      setIsLiked(true);
      if (onNotification) onNotification(`"${post.content}" was liked!`);
    } catch (err) {
      console.error("Error liking post:", err.message);
    }
  };

  const handleUnlike = async () => {
    try {
      await unlikePost(post._id);
      setLikesCount((prev) => prev - 1);
      setIsLiked(false);
    } catch (err) {
      console.error("Error unliking post:", err.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await addComment(post._id, { text: newComment });
      setNewComment("");
      setComments((prev) => [...prev, res.data.comment]);
      if (onNotification)
        onNotification(`"${post.content}" received a new comment!`);

      // Emit new comment via socket
      socket.emit("add-comment", { postId: post._id, text: newComment });
    } catch (err) {
      console.error("Error adding comment:", err.message);
    }
  };

  const toggleComments = () => {
    if (!isCommentsVisible) {
      loadComments();
    }
    setIsCommentsVisible((prev) => !prev);
  };

  useEffect(() => {
    loadComments();

    // Listen for new comments via socket
    socket.on("new-comment", (comment) => {
      if (comment.postId === post._id) {
        setComments((prev) => [...prev, comment]);
      }
    });

    return () => {
      socket.off("new-comment");
    };
  }, [loadComments, post._id]);

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 transition hover:shadow-xl">
      <h4 className="text-lg font-bold text-green-400">
        {post.userId.username}
      </h4>
      <p className="text-gray-300 mt-2">{post.content}</p>
      {post.caption && (
        <p className="text-sm italic text-gray-500 mt-1">{post.caption}</p>
      )}
      <div className="flex items-center justify-between mt-4">
        <p className="text-gray-400">Likes: {likesCount}</p>
        <div className="flex items-center space-x-6">
          {!isLiked ? (
            <button
              onClick={handleLike}
              className="text-sm text-green-400 hover:text-green-300"
            >
              Like
            </button>
          ) : (
            <button
              onClick={handleUnlike}
              className="text-sm text-red-500 hover:text-red-400"
            >
              Unlike
            </button>
          )}
          <button
            onClick={toggleComments}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {isCommentsVisible ? "Hide Comments" : "View Comments"}
          </button>
        </div>
      </div>

      {isCommentsVisible && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          <h5 className="text-sm font-semibold text-gray-300">Comments</h5>
          {isLoadingComments ? (
            <p className="text-sm text-gray-500 mt-2">Loading comments...</p>
          ) : (
            <div className="space-y-2 mt-2">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-300 bg-gray-700 p-2 rounded-md"
                >
                  <strong className="text-green-400">
                    {comment.userId?._id === loggedInUserId ? "You" : "User"}:
                  </strong>{" "}
                  {comment.text}
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleAddComment} className="mt-4 flex">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-700 text-gray-300 border border-gray-600 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition"
            >
              Comment
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Post;
