import React from "react";
import { useNavigate } from "react-router-dom";
import application from "../Images/application-icon.png";

const BottomBar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#F16F24] shadow-lg flex justify-around items-center h-[60px]">
      {/* Home Button */}
      <button
        onClick={() => navigate("/home")}
        className="flex flex-col items-center text-[#ffffff] hover:text-[#ffffff] focus:outline-none"
      >
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          <path
            fill="#ffffff"
            d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
          />
        </svg>
        <span className="text-sm font-semibold">Home</span>
      </button>

      {/* Attendance Button */}
      <button
        onClick={() => navigate("/attendance")}
        className="flex flex-col items-center text-[#ffffff] hover:text-[#ffffff] focus:outline-none"
      >
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <path
            fill="#ffffff"
            d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM128 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM80 432c0-44.2 35.8-80 80-80l64 0c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16L96 448c-8.8 0-16-7.2-16-16z"
          />
        </svg>
        <span className="text-sm font-semibold">Attendance</span>
      </button>

      {/* Profile Button */}
      <button
        onClick={() => navigate("/profile")}
        className="flex flex-col items-center text-[#ffffff] hover:text-[#ffffff] focus:outline-none"
      >
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="#ffffff"
            d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z"
          />
        </svg>
        <span className="text-sm font-semibold">Profile</span>
      </button>

      {/* Application Button */}
      <button
        onClick={() => navigate("/leave-request")}
        className="flex flex-col items-center text-[#ffffff] hover:text-[#ffffff] focus:outline-none"
      >
        <img className="w-5 h-5" alt="" src={application} />
        <span className="text-sm font-semibold">Application</span>
      </button>
    </div>
  );
};

export default BottomBar;
