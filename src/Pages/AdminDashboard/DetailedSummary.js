import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"; // Import the xlsx library

const DetailedSummary = () => {
  const [reports, setReports] = useState([]);
  const [group, setGroup] = useState("NMT");
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  const [selectedRole, setSelectedRole] = useState("MR");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState(null);
  const [totalWorkingDays, setTotalWorkingDays] = useState(null);
  const [pendingReq, setPendingReq] = useState(0);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const dayCount = dayjs(selectedMonth).daysInMonth();

  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchWorkingDays(selectedMonth);
    fetchUserReports(
      selectedMonth,
      selectedRole,
      storedUser.group || (selectedRole === "super admin" ? "" : group),
      storedUser.zone
    );
    fetchPendingRequest();
  }, [selectedMonth, selectedRole, group]);

  const fetchPendingRequest = async () => {
    try {
      const response = await axios.get(
        `https://attendance-app-server-blue.vercel.app/api/pending-requests`
      );
      setPendingReq(response.data.pendingCount);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      setPendingReq(0);
    }
  };

  const fetchWorkingDays = async (month) => {
    try {
      const response = await axios.get(
        `https://attendance-app-server-blue.vercel.app/api/workingdays`,
        {
          params: { month },
        }
      );
      const { workingDays } = response.data;
      setTotalWorkingDays(workingDays);
    } catch (error) {
      console.error("Error fetching working days:", error);
      setTotalWorkingDays(null);
    }
  };

  const fetchApprovedLeaves = async (userId, month, year) => {
    try {
      const response = await axios.get(
        `https://attendance-app-server-blue.vercel.app/api/leave-requests/user/${userId}/monthly`,
        {
          params: { month, year },
        }
      );
      const { leaveDays } = response.data;
      return leaveDays || 0;
    } catch (error) {
      console.error(
        `Error fetching approved leaves for user ${userId}:`,
        error
      );
      return 0;
    }
  };

  const fetchUserReports = async (month, role, group, zone) => {
    setLoading(true);
    setError(null);
    try {
      const [year, monthNumber] = month.split("-");
      const usersResponse = await axios.get(
        `https://attendance-app-server-blue.vercel.app/getAllUser`,
        {
          params: { role, group, zone },
        }
      );
      const users = usersResponse.data;

      const reportsData = await Promise.all(
        users.map(async (user) => {
          const checkInsResponse = await axios.get(
            `https://attendance-app-server-blue.vercel.app/api/checkins/${user._id}`,
            {
              params: { month: monthNumber, year: year },
            }
          );
          const checkOutsResponse = await axios.get(
            `https://attendance-app-server-blue.vercel.app/api/checkouts/${user._id}`,
            {
              params: { month: monthNumber, year: year },
            }
          );

          const checkIns = checkInsResponse.data;
          const checkOuts = checkOutsResponse.data;

          // Create an object to store daily check-in/check-out times
          const dailyTimes = {};
          for (let day = 1; day <= dayCount; day++) {
            const date = `${year}-${monthNumber}-${String(day).padStart(
              2,
              "0"
            )}`;
            const checkIn = checkIns.find(
              (checkin) => dayjs(checkin.time).format("YYYY-MM-DD") === date
            );
            const checkOut = checkOuts.find(
              (checkout) => dayjs(checkout.time).format("YYYY-MM-DD") === date
            );

            dailyTimes[day] = {
              in: checkIn ? dayjs(checkIn.time).format("hh:mm A") : "",
              out: checkOut ? dayjs(checkOut.time).format("hh:mm A") : "",
            };
          }

          return {
            username: user.name,
            number: user.number,
            outlet: user.outlet || "N/A", // Assuming outlet is part of user data
            zone: user.zone,
            dailyTimes,
          };
        })
      );
      setReports(reportsData);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError("Failed to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  // Function to export the report to Excel in the desired format
  const exportToExcel = () => {
    const worksheetData = [];

    // Add headers
    const headers = ["Name", "Number", "Outlet", "Zone"];
    for (let day = 1; day <= dayCount; day++) {
      headers.push(day);
      headers.push(""); // Empty cell for merged "In" and "Out"
    }
    worksheetData.push(headers);

    // Add sub-headers for "In" and "Out"
    const subHeaders = ["", "", "", ""];
    for (let day = 1; day <= dayCount; day++) {
      subHeaders.push("In", "Out");
    }
    worksheetData.push(subHeaders);

    // Add employee data
    reports.forEach((report) => {
      const row = [report.username, report.number, report.outlet, report.zone];
      for (let day = 1; day <= dayCount; day++) {
        row.push(report.dailyTimes[day].in, report.dailyTimes[day].out);
      }
      worksheetData.push(row);
    });

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Merge date headers
    for (let day = 1; day <= dayCount; day++) {
      const startCol = 4 + (day - 1) * 2;
      const endCol = startCol + 1;
      worksheet["!merges"] = worksheet["!merges"] || [];
      worksheet["!merges"].push({
        s: { r: 0, c: startCol },
        e: { r: 0, c: endCol },
      });
    }

    // Create workbook and trigger download
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Report");
    XLSX.writeFile(workbook, `Monthly_Report_${selectedMonth}.xlsx`);
  };

  return (
    <div className="flex">
      {/* Side Drawer */}
      <div
        className={`fixed md:relative z-20 bg-gray-800 text-white min-w-64 h-screen transform ${
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

        <h1 className="text-xl font-bold mb-4">Monthly Attendance Report</h1>

        {/* Export Button */}
        <button
          onClick={exportToExcel}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export Report
        </button>

        <div className="mb-4 flex items-center space-x-4">
          <div>
            <label className="mr-2 font-semibold">Select Month:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border rounded px-2 py-1"
            />
          </div>
          {storedUser?.role === "super admin" && (
            <div>
              <label className="mr-2 font-semibold">Filter by Group:</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="NMT">NMT</option>
                <option value="AMD">AMD</option>
                <option value="GVI">GVI</option>
              </select>
            </div>
          )}

          <div>
            <label className="mr-2 font-semibold">Filter by User Role:</label>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="border rounded px-2 py-1"
            >
              {storedUser?.role === "super admin" && (
                <option value="office">Office</option>
              )}
              {storedUser?.role === "super admin" && (
                <option value="super admin">Super Admin</option>
              )}
              {(storedUser?.role === "super admin" ||
                storedUser?.role === "RSM") && <option value="RSM">RSM</option>}

              {(storedUser?.role === "super admin" ||
                storedUser?.role === "RSM" ||
                storedUser?.role === "TSO") && <option value="TSO">TSO</option>}

              {(storedUser?.role === "super admin" ||
                storedUser?.role === "RSM" ||
                storedUser?.role === "ASM") && <option value="ASM">ASM</option>}

              <option value="MR">MR</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : reports.length > 0 ? (
          <div className="overflow-x-auto w-[95vw] sm:w-[auto]">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Username</th>
                  <th className="border border-gray-300 px-4 py-2">Number</th>
                  <th className="border border-gray-300 px-4 py-2">Outlet</th>
                  <th className="border border-gray-300 px-4 py-2">Zone</th>
                  {Array.from({ length: dayCount }, (_, i) => (
                    <th
                      key={i + 1}
                      colSpan={2}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {i + 1}
                    </th>
                  ))}
                </tr>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2"></th>
                  <th className="border border-gray-300 px-4 py-2"></th>
                  <th className="border border-gray-300 px-4 py-2"></th>
                  <th className="border border-gray-300 px-4 py-2"></th>
                  {Array.from({ length: dayCount }, (_, i) => (
                    <React.Fragment key={i + 1}>
                      <th className="border border-gray-300 px-4 py-2">In</th>
                      <th className="border border-gray-300 px-4 py-2">Out</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">
                      {report.username}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {report.number}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {report.outlet}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {report.zone}
                    </td>
                    {Array.from({ length: dayCount }, (_, i) => (
                      <React.Fragment key={i + 1}>
                        <td className="border border-gray-300 px-4 py-2 bg-green-300">
                          {report.dailyTimes[i + 1]?.in}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 bg-red-300">
                          {report.dailyTimes[i + 1]?.out}
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No reports found for this month.</p>
        )}
      </div>
    </div>
  );
};

export default DetailedSummary;
