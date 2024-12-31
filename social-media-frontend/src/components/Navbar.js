import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-green-400">
          Social<span className="text-teal-300">Hub👀</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/dashboard"
            className="hover:text-green-400 font-semibold transition duration-300"
          >
            Dashboard
          </Link>

          <Link
            to="/blogs"
            className="hover:text-green-400 font-semibold transition duration-300"
          >
            Blogs
          </Link>
          {!username ? (
            <>
              <Link
                to="/login"
                className="hover:text-green-400 font-semibold transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-green-400 font-semibold transition duration-300"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:text-red-400 font-semibold transition duration-300"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="block md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <Link
            to="/dashboard"
            className="block text-center hover:text-green-400 font-semibold transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/blogs"
            className="block text-center hover:text-green-400 font-semibold transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Blogs
          </Link>
          {!username ? (
            <>
              <Link
                to="/login"
                className="block text-center hover:text-green-400 font-semibold transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-center hover:text-green-400 font-semibold transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="block text-center hover:text-red-400 font-semibold transition duration-300"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
