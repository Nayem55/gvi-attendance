import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const HistoryPage = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user data

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `https://attendance-app-server-blue.vercel.app/api/leave-requests/user/${user._id}`
        );

        setLeaveHistory(response.data || []);
      } catch (error) {
        console.error("Error fetching leave history:", error);
        toast.error("Failed to load leave history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user._id]);

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-6">Leave Application History</h1>

      {loading ? (
        <div className="text-center">
          <p className="text-lg">Loading your leave history...</p>
        </div>
      ) : leaveHistory.length === 0 ? (
        <div className="text-center">
          <p className="text-lg">No leave requests found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow rounded overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-left text-sm font-semibold">
                <th className="p-3">Start Date</th>
                <th className="p-3">End Date</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3">Requested On</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((request) => (
                <tr key={request._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 whitespace-nowrap">
                    {new Date(request.leaveStartDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {new Date(request.leaveEndDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">{request.leaveReason}</td>
                  <td
                    className={`p-3 font-semibold ${
                      request.status === "approved"
                        ? "text-green-600"
                        : request.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
