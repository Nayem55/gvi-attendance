import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
    }
  }, []);

  const fetchApplications = async (year, month) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://attendance-app-server-blue.vercel.app/api/leave-requests?year=${year}&month=${month}`
      );

      if (storedUser?.group && !storedUser?.zone) {
        setApplications(
          response.data.filter((data) => storedUser.group === data.group) || []
        );
      } else if (storedUser?.group && storedUser?.zone) {
        setApplications(
          response.data.filter(
            (data) =>
              storedUser.group === data.group &&
              storedUser.zone === data.zone
          ) || []
        );
      } else {
        setApplications(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching leave applications:", error);
      toast.error("Failed to load leave applications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const year = selectedMonth.year();
    const month = selectedMonth.month() + 1; // dayjs month is 0-based
    fetchApplications(year, month);
  }, [selectedMonth]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `https://attendance-app-server-blue.vercel.app/api/leave-requests/${id}`,
        { status: newStatus }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: newStatus } : app
        )
      );
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again later.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    try {
      await axios.delete(
        `https://attendance-app-server-blue.vercel.app/api/leave-requests/${id}`
      );
      setApplications((prev) => prev.filter((app) => app._id !== id));
      toast.success("Application deleted successfully!");
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application. Please try again later.");
    }
  };

  return (
    <div className="flex">
      {/* Side Drawer */}
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
            to="/admin/today-report"
            className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700"
          >
            Today's Report
          </Link>
          <Link
            to="/admin/monthly-summary"
            className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700"
          >
            Monthly Summary
          </Link>
          <Link
            to="/admin/monthly-details"
            className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700"
          >
            Monthly Details
          </Link>
          <Link
            to="/admin/applications"
            className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700"
          >
            Leave Requests
          </Link>
          {storedUser?.role === "super admin" && (
            <Link
              to="/admin/user"
              className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700 flex items-center"
            >
              Users
            </Link>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen p-4 md:p-6 bg-gray-100">
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="md:hidden mb-4 px-4 py-2 bg-gray-800 text-white rounded"
        >
          {isDrawerOpen ? "Close Menu" : "Open Menu"}
        </button>

        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h1 className="text-2xl font-bold">Leave Applications</h1>
          <input
            type="month"
            value={selectedMonth.format("YYYY-MM")}
            onChange={(e) => setSelectedMonth(dayjs(e.target.value))}
            className="border p-2 rounded"
          />
        </div>

        {loading ? (
          <div className="text-center">
            <p className="text-lg">Loading leave applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center">
            <p className="text-lg">No leave applications found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-white shadow rounded overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-left text-sm font-semibold">
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Start Date</th>
                  <th className="p-3">End Date</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Requested On</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr
                    key={application._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3">{application.userName}</td>
                    <td className="p-3">{application.phoneNumber}</td>
                    <td className="p-3">
                      {dayjs(application.leaveStartDate).format("YYYY-MM-DD")}
                    </td>
                    <td className="p-3">
                      {dayjs(application.leaveEndDate).format("YYYY-MM-DD")}
                    </td>
                    <td className="p-3">{application.leaveReason}</td>
                    <td className="p-3">
                      <select
                        value={application.status}
                        onChange={(e) =>
                          handleStatusChange(application._id, e.target.value)
                        }
                        className={`border p-1 rounded ${
                          application.status === "approved"
                            ? "text-green-600"
                            : application.status === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-3">
                      {dayjs(application.createdAt).format("YYYY-MM-DD")}
                    </td>
                    <td className="p-3 flex space-x-2">
                      <button
                        onClick={() => handleDelete(application._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
