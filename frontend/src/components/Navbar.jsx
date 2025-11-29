import { Link } from "react-router-dom";
import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 px-6 py-4 bg-black/30 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Study With AI</h1>

        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-gray-300 hover:text-white transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl"
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
}
