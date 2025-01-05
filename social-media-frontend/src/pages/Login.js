import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const res = await axios.post(
        "https://socialhub-backend-3j7g.onrender.com/api/auth/login",
        formData
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      setMessage("Logged in ✅");
      setTimeout(() => {
        setMessage("");
        setIsLoading(false); // Stop loading
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Login Error:", err.response?.data?.message || err.message);
      setMessage(err.response?.data?.message || "Invalid credentials ❌");
      setTimeout(() => {
        setMessage("");
        setIsLoading(false); // Stop loading
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gray-800 shadow-2xl rounded-3xl p-8">
        <h2 className="text-4xl font-extrabold text-center text-green-400 mb-4">
          Welcome Back
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Login to your account and join the community.
        </p>
        {message && (
          <div
            className={`${
              message.includes("✅")
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            } text-center py-3 px-5 rounded-lg shadow-md mb-4`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              onChange={handleChange}
              value={formData.username}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-green-400"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              onChange={handleChange}
              value={formData.password}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-green-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 rounded-lg shadow-lg font-bold hover:from-teal-500 hover:to-green-400 focus:ring-4 focus:ring-green-300 transition duration-300 flex items-center justify-center"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-green-400 hover:text-teal-300 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

