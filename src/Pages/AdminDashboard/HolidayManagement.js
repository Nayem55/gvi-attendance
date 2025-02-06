import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const HolidayPage = () => {
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ date: "", name: "" });
  const [editHoliday, setEditHoliday] = useState(null); // To store the holiday being edited
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const yesterday = dayjs()
    .tz("Asia/Dhaka")
    .subtract(1, "day")
    .format("YYYY-MM-DD");
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://attendance-app-server-blue.vercel.app/api/holidays"
      );
      setHolidays(response.data);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    } finally {
      setLoading(false);
    }
  };

  const addHoliday = async () => {
    try {
      await axios.post(
        "https://attendance-app-server-blue.vercel.app/api/holidays",
        newHoliday
      );
      toast.success("Holiday added successfully");
      setNewHoliday({ date: "", name: "" });
      fetchHolidays();
    } catch (error) {
      console.error("Error adding holiday:", error);
      toast.error("Failed to add holiday");
    }
  };

  const deleteHoliday = async (holidayId) => {
    try {
      await axios.delete(
        `https://attendance-app-server-blue.vercel.app/api/holidays/${holidayId}`
      );
      toast.success("Holiday deleted successfully");
      fetchHolidays();
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast.error("Failed to delete holiday");
    }
  };

  const openEditModal = (holiday) => {
    setEditHoliday(holiday);
  };

  const saveHolidayChanges = async () => {
    try {
      await axios.put(
        `https://attendance-app-server-blue.vercel.app/api/holidays/${editHoliday._id}`,
        editHoliday
      );
      toast.success("Holiday updated successfully");
      setEditHoliday(null); // Close modal
      fetchHolidays();
    } catch (error) {
      console.error("Error updating holiday:", error);
      toast.error("Failed to update holiday");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
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
            Holidays
          </Link>
          <Link
            to="/admin/applications"
            className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700"
          >
            Leave Requests
          </Link>
          <Link
            to="/admin/user"
            className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700 flex items-center"
          >
            Users
          </Link>
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

        <h1 className="text-xl font-bold mb-4">Holiday Management</h1>

        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Holiday Name:
          </label>
          <input
            type="text"
            value={newHoliday.name}
            onChange={(e) =>
              setNewHoliday((prev) => ({ ...prev, name: e.target.value }))
            }
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/2"
          />

          <label className="block text-gray-700 font-bold mt-4 mb-2">
            Holiday Date:
          </label>
          <input
            type="date"
            value={newHoliday.date}
            onChange={(e) =>
              setNewHoliday((prev) => ({ ...prev, date: e.target.value }))
            }
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/2"
          />

          <button
            onClick={addHoliday}
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-[#F16F24] ease-in-out duration-200 ml-6"
          >
            Add Holiday
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">
                  Holiday Name
                </th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday) => (
                <tr key={holiday._id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {holiday.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {holiday.date}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <button
                      onClick={() => openEditModal(holiday)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHoliday(holiday._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editHoliday && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Edit Holiday</h2>
            <label className="block text-gray-700 font-bold mb-2">
              Holiday Name:
            </label>
            <input
              type="text"
              value={editHoliday.name}
              onChange={(e) =>
                setEditHoliday((prev) => ({ ...prev, name: e.target.value }))
              }
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />

            <label className="block text-gray-700 font-bold mt-4 mb-2">
              Holiday Date:
            </label>
            <input
              type="date"
              value={editHoliday.date}
              onChange={(e) =>
                setEditHoliday((prev) => ({ ...prev, date: e.target.value }))
              }
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setEditHoliday(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveHolidayChanges}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayPage;
