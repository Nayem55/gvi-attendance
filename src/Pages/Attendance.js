import React, { useState } from "react";
import axios from "axios";

const Attendance = ({ userId }) => {
  const [action, setAction] = useState("");
  const [message, setMessage] = useState("");

  const handleAttendance = async () => {
    try {
      const response = await axios.post(
        "https://attendance-app-server-blue.vercel.app/attendance",
        {
          userId,
          action,
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="attendance-form">
      <h3>Mark Your Attendance</h3>
      <select
        value={action}
        onChange={(e) => setAction(e.target.value)}
        className="input-field"
      >
        <option value="">Select Action</option>
        <option value="check-in">Check In</option>
        <option value="check-out">Check Out</option>
      </select>
      <button onClick={handleAttendance} className="submit-button">
        Submit
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Attendance;
