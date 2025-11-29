import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Login response:", data);
      if (data.success) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.error);
      }

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      alert("Login success!");
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 bg-black text-white justify-center">
    <Home size={28} />
    <span className="text-lg font-semibold"></span>
  </Link>
      
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-8 shadow-xl border border-zinc-800">
        <h2 className="text-4xl font-bold text-center text-white mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              name="email"
              type="email"
              className="w-full px-4 py-3 mt-1 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-blue-500 transition"
              placeholder="Enter email"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              name="password"
              type="password"
              className="w-full px-4 py-3 mt-1 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-blue-500 transition"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold text-lg"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 text-center mt-5">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:text-blue-400">
            Signup
          </a>
        </p>
      </div>
    </div>
     <Footer/>
    </>
  );
}
