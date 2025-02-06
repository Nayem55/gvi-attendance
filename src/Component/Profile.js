import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);

    const updatedUser = { ...user, password: newPassword || user?.password };

    try {
      // Send a PUT request to update the user
      const response = await fetch(
        `https://attendance-app-server-blue.vercel.app/updateUser/${user?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);

        // Update local storage with the updated user data
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setLoading(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update profile.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 mb-12">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-center mb-4">Profile</h2>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="text-2xl font-semibold text-center mb-4"
          >
            <svg
              className="w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="#ff0000"
                d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 224c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"
              />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Name
          </label>
          <input
            type="text"
            readOnly
            id="name"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F16F24]"
            value={user?.name}
            // onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Role
          </label>
          <input
            type="text"
            readOnly
            id="name"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F16F24]"
            value={user?.role}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            readOnly
            id="email"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F16F24]"
            value={user?.email}
            // onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="number" className="block text-gray-700">
            Phone
          </label>
          <input
            type="number"
            readOnly
            id="number"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F16F24]"
            value={user?.number}
            // onChange={(e) => setUser({ ...user, number: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type="test"
            id="password"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F16F24]"
            value={user?.password}
          />
        </div>
        {/* <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F16F24]"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div> */}

        {/* <div className="mb-4">
          <label htmlFor="confirm-password" className="block text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F16F24]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div> */}

        {/**<div className="text-center mt-6">
          {loading ? (
            <button
              className="w-full py-3 bg-[#cccccc] text-white rounded-md"
            >
              Please wait...
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="w-full py-3 bg-[#F16F24] text-white rounded-md hover:bg-black"
            >
              Save Changes
            </button>
          )}
        </div>**/}
      </div>
    </div>
  );
};

export default Profile;
