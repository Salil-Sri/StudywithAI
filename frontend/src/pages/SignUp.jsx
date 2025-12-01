import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Footer from "../components/Footer";
import { Home } from "lucide-react";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "https://studywithai-1.onrender.com/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();
    console.log(data);
    if (data.success) {
      alert("Signup successful!");
    } else {
      alert(data.error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-8">
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 bg-black text-white justify-center"
        >
          <Home size={28} />
          <span className="text-lg font-semibold"></span>
        </Link>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Username"
              onChange={handleChange}
              className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-2 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-2 outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-2 outline-none"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-xl text-lg"
            >
              Sign Up
            </button>
            <p className="text-gray-400 text-center mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:text-blue-400">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
