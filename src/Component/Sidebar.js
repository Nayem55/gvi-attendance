import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div
      className={`fixed md:relative z-20 bg-gray-800 text-white w-64 h-screen transform ${
        isDrawerOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300`}
    >
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <button
          onClick={() => setIsDrawerOpen(false)}
          className="text-white md:hidden focus:outline-none"
        >
          ✕
        </button>
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        <Link
          to="/admin"
          className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700"
        >
          Attendance Report
        </Link>
        <Link
          to="/admin/today-report"
          className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700"
        >
          Today's Report
        </Link>
        <Link
          to="/admin/holiday-management"
          className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700"
        >
          Holiday
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
