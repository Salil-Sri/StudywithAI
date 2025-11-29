import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-6">
      <div className="container mx-auto text-center">

        <h2 className="text-xl font-semibold mb-2">
          Study With AI
        </h2>
        <p className="text-gray-400">
          © {new Date().getFullYear()} All Rights Reserved.
        </p>

        <div className="flex justify-center gap-6 mt-4 text-gray-400">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </div>

      </div>
    </footer>
  );
}
