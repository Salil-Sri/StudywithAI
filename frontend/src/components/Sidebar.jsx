import React from "react";
import { User, Notebook } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ open, currentView, setCurrentView }) {
  const navigate = useNavigate();

  const menuItems = [
    { id: "profile", title: "Profile", icon: <User size={18} /> },
    { id: "notes", title: "My Notes", icon: <Notebook size={18} /> },
  ];

  return (
    <div
      className={`fixed top-15 right-0 h-full z-50 transition-transform duration-300
      ${open ? "translate-x-0" : "translate-x-full"}
      w-64 bg-white/5 border-r border-white/10 p-5 text-white`}
    >
      <h2 className="text-xl font-semibold mb-8">Study AI</h2>

      <div className="bg-white/10 rounded-xl px-4 py-6 mb-8">
        <p className="font-medium">Welcome 👋</p>
        <p className="text-xs text-gray-400">user@gmail.com</p>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex items-center gap-2 p-3 rounded-lg text-left hover:bg-white/10 transition ${
              currentView === item.id ? "bg-white/10" : ""
            }`}
          >
            {item.icon}
            {item.title}
          </button>
        ))}
      </div>

      <button
        className="absolute bottom-5 left-5 bg-red-600 px-4 py-2 rounded-lg"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
