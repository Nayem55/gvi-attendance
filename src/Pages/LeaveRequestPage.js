import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const LeaveRequestPage = () => {
  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [isMultipleDays, setIsMultipleDays] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const leaveData = {
      userName: user?.name,
      group: user?.group || "",
      zone: user?.zone || "",
      role: user?.role || "",
      userId: user?._id,
      phoneNumber: user?.number,
      leaveStartDate,
      leaveEndDate: isMultipleDays ? leaveEndDate : leaveStartDate,
      leaveReason,
      status: "pending", // The leave request starts with 'pending' status
    };

    try {
      const response = await axios.post(
        "https://attendance-app-server-blue.vercel.app/api/leave-requests",
        leaveData
      );

      if (response.status === 201) {
        toast.success(
          response.data.message || "Leave request submitted successfully!"
        );
        setLeaveStartDate("");
        setLeaveEndDate("");
        setLeaveReason("");
        setIsMultipleDays(false); // Reset checkbox
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error(
        "Error submitting leave request:",
        error.response || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "There was an error submitting your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Request Leave</h1>
        <Link
          to="/leave-history"
          className="text-sm bg-black hover:bg-[#002B54] ease-in-out duration-200 text-[#ffffff] px-3 py-2 rounded font-bold mb-4"
        >
          History
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
        <div className="mb-4">
          <label
            htmlFor="userName"
            className="block text-sm font-semibold mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="userName"
            value={user.name}
            readOnly
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-semibold mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={user.number}
            readOnly
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="leaveStartDate"
            className="block text-sm font-semibold mb-2"
          >
            Leave Start Date
          </label>
          <input
            type="date"
            id="leaveStartDate"
            value={leaveStartDate}
            onChange={(e) => setLeaveStartDate(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {isMultipleDays && (
          <div className="mb-4">
            <label
              htmlFor="leaveEndDate"
              className="block text-sm font-semibold mb-2"
            >
              Leave End Date
            </label>
            <input
              type="date"
              id="leaveEndDate"
              value={leaveEndDate}
              onChange={(e) => setLeaveEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="leaveReason"
            className="block text-sm font-semibold mb-2"
          >
            Leave Reason
          </label>
          <textarea
            id="leaveReason"
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
            required
            rows="4"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isMultipleDays"
            checked={isMultipleDays}
            onChange={() => setIsMultipleDays(!isMultipleDays)}
            className="mr-2"
          />
          <label htmlFor="isMultipleDays" className="text-sm font-semibold">
            Multiple Days Leave
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 bg-[#002B54] hover:bg-black ease-in-out duration-200 mb-10 text-white rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Leave Request"}
        </button>
      </form>

      {statusMessage && (
        <div className="mt-4 text-center text-lg font-semibold">
          <p>{statusMessage}</p>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestPage;
