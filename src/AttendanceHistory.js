import React, { useState, useEffect } from 'react';

const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    // Fetch attendance history from the backend
    // Mock data for now
    const mockAttendanceData = [
      {
        clockIn: '2024-12-15 08:00 AM',
        clockOut: '2024-12-15 05:00 PM',
        location: { lat: '23.8103', lon: '90.4125' },
      },
      {
        clockIn: '2024-12-14 08:15 AM',
        clockOut: '2024-12-14 05:15 PM',
        location: { lat: '23.8110', lon: '90.4130' },
      },
    ];
    setAttendance(mockAttendanceData);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Attendance History</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-6 text-left text-gray-700">Date</th>
                <th className="py-3 px-6 text-left text-gray-700">Clock-In</th>
                <th className="py-3 px-6 text-left text-gray-700">Clock-Out</th>
                <th className="py-3 px-6 text-left text-gray-700">Location</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-3 px-6 text-center text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendance.map((record, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-6 text-gray-700">{record.clockIn.split(' ')[0]}</td>
                    <td className="py-3 px-6 text-gray-700">{record.clockIn.split(' ')[1]}</td>
                    <td className="py-3 px-6 text-gray-700">{record.clockOut.split(' ')[1]}</td>
                    <td className="py-3 px-6 text-gray-700">
                      Lat: {record.location.lat}, Lon: {record.location.lon}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
