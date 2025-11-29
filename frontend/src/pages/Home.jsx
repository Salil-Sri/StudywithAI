import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <Navbar/>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl text-center"
      >
        <h1 className="text-5xl font-bold mb-4">
          AI Powered Study Notes Generator
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          Upload your PDF and instantly generate notes, summary, flashcards,
          questions and keywords.
        </p>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-lg">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl text-lg font-medium cursor-pointer">
            <Upload size={22} />
            Upload PDF
          </button>
        </div>
      </motion.div>
    </div>
    <Footer/>
    </>
  );
}
