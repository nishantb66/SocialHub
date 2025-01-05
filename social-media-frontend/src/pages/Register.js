import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const res = await axios.post(
        "https://socialhub-backend-3j7g.onrender.com/api/auth/register",
        formData
      );
      setMessage("User registered successfully✅");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(
        "Registration Error:",
        err.response?.data?.message || err.message
      );
      setMessage(err.response?.data?.message || "Registration failed❌");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 flex flex-col">
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto px-6">
        {/* Left Section */}
        <div className="md:w-1/2 flex flex-col items-start space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-green-400">
            Welcome to SocialHub👀
          </h1>
          <p className="text-lg md:text-xl text-gray-400">
            Connect, share, and grow with our community. Start your journey
            today and explore a brighter world.
          </p>
          <button
            className="bg-gradient-to-r from-green-500 to-teal-400 text-white py-3 px-8 rounded-lg shadow-lg text-lg font-semibold hover:from-teal-400 hover:to-green-500"
            onClick={() => (window.location.href = "/login")}
          >
            Join Now
          </button>
        </div>

        {/* Right Section - Registration Form */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg mt-10 md:mt-0 md:ml-10">
          <h2 className="text-3xl font-extrabold text-green-400 mb-6 text-center">
            Create an Account
          </h2>
          {message && (
            <div
              className={`${
                message.includes("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              } text-center py-2 px-4 rounded-lg shadow-md mb-4`}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
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
                className="w-full bg-gray-700 text-gray-300 border-none rounded-lg p-3 focus:ring-4 focus:ring-green-500 shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                onChange={handleChange}
                value={formData.email}
                required
                className="w-full bg-gray-700 text-gray-300 border-none rounded-lg p-3 focus:ring-4 focus:ring-green-500 shadow-sm"
              />
            </div>
            <div>
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
                placeholder="Create a password"
                onChange={handleChange}
                value={formData.password}
                required
                className="w-full bg-gray-700 text-gray-300 border-none rounded-lg p-3 focus:ring-4 focus:ring-green-500 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-teal-400 hover:from-teal-400 hover:to-green-500 text-white py-3 rounded-lg font-bold shadow-md transition duration-300 flex items-center justify-center"
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
                "Register"
              )}
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-gray-400">
            Already have an account?{" "}
            <span
              className="text-green-400 hover:underline cursor-pointer"
              onClick={() => (window.location.href = "/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </div>

      <footer className="bg-gray-800 py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} SocialHub. All rights reserved.
      </footer>
    </div>
  );
}

export default Register;
