import React, { useState } from "react";
import { Link } from "react-router-dom";
import gvilogo from "../Images/Gvi-logo.png";
import amdlogo from "../Images/Amd-logo.png";
import application from "../Images/Application2.png";
import admin from "../Images/admin-panel.png";
import dashboard from "../Images/dashboard.png";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex top-0 justify-between items-center p-4 bg-[#ffffff] shadow-md">
        <Link to="/">
          <img className={`w-[60px]`} src={gvilogo} alt="Logo" />
        </Link>
        <div className="flex items-center gap-4">
          <button
            className="text-xl bg-gray-100 p-2 rounded-md focus:outline-none"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Sidebar */}
      <div
        className={`fixed top-0 w-[80vw] sm:w-[30vw] left-0 h-full bg-[#ffffff] shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-between items-center p-4 bg-[#F16F24] text-white">
          <h2 className="text-lg font-bold">{user ? user?.name : "Menu"}</h2>
          <button
            className="text-white text-xl focus:outline-none"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="py-4">
          <Link
            to="/"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md flex gap-4 items-center"
            onClick={toggleSidebar}
          >
            <svg
              className="w-[32px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
            </svg>
            <p className="font-bold">Home</p>
          </Link>
          <Link
            to="/check-in"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md flex gap-4 items-center"
            onClick={toggleSidebar}
          >
            <svg
              className="w-[32px] p-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path
                fill="#000"
                d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM128 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM80 432c0-44.2 35.8-80 80-80l64 0c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16L96 448c-8.8 0-16-7.2-16-16z"
              />
            </svg>
            <p className="font-bold">Attendance</p>
          </Link>
          <Link
            to="/profile"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md flex gap-4 items-center"
            onClick={toggleSidebar}
          >
            <svg
              className="w-[32px] border border-black p-1 rounded-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
            </svg>
            <p className="font-bold">Profile</p>
          </Link>
          <Link
            to={"/leave-request"}
            className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md flex gap-4 items-center"
            onClick={toggleSidebar}
          >
            <img className="w-[32px]" alt="" src={application} />
            <p className="font-bold">Application</p>
          </Link>
          <Link
            to={"/user-dashboard"}
            className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md flex gap-4 items-center"
            onClick={toggleSidebar}
          >
            <img className="w-[32px]" alt="" src={dashboard} />

            <p className="font-bold">Dashboard</p>
          </Link>
          {(user?.role !== "MR") && (
            <Link
              to={"/admin"}
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md flex gap-4 items-center"
              onClick={toggleSidebar}
            >
              <img className="w-[32px]" alt="" src={admin} />
              <p className="font-bold">Admin Panel</p>
            </Link>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Header;
