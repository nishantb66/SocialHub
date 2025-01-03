import axios from "axios";

// Base API instance
const API = axios.create({ baseURL: "https://socialhub-backend-3j7g.onrender.com/api" });

// Interceptor to attach the Authorization token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth Routes
export const register = (formData) => API.post("/auth/register", formData);
export const login = (formData) => API.post("/auth/login", formData);

// Post Routes
export const fetchMyPosts = () => API.get("/posts/my-posts");
export const createPost = (formData) => API.post("/posts", formData);
export const searchUserPosts = (username) => API.get(`/posts/user/${username}`);
// Like Post
export const likePost = (postId) => API.put(`/posts/${postId}/like`);
// Unlike Post
export const unlikePost = (postId) => API.put(`/posts/${postId}/unlike`);
// Comment Routes
export const addComment = (postId, commentData) =>
  API.post(`/posts/${postId}/comment`, commentData);
export const fetchComments = (postId) => API.get(`/posts/${postId}/comments`);

// Friend Routes
export const fetchFriends = () => API.get("/friends"); // Fetch all friends
export const addFriend = (friendUsername) =>
  API.post("/friends/add", { friendUsername });
export const fetchFriendPosts = (friendId) =>
  API.get(`/posts/user/${friendId}`); // Fetch posts of a specific friend

// Blog Routes
export const createBlog = (formData) => API.post("/blogs", formData);
export const fetchAllBlogs = () => API.get("/blogs");
export const fetchMyBlogs = () => API.get("/blogs/my-blogs");

// Fetch unread messages for the logged-in user
export const fetchUnreadMessages = (username) =>
  API.get(`/messages/unread?username=${username}`);

// Mark messages as read
export const markMessagesAsRead = (messageIds) =>
  API.put("/messages/mark-read", { messageIds });

