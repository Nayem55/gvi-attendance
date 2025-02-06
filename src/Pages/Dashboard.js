import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('Not Clocked In');
  const [lastClockIn, setLastClockIn] = useState(null);

  // Get user's location when the component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  }, []);

  const handleClockIn = () => {
    if (location) {
      // Mock API call to save the clock-in info along with the location
      console.log('Clocking in at:', location);
      setStatus('Clocked In');
      setLastClockIn(new Date().toLocaleString());
    } else {
      alert('Unable to fetch location. Please try again.');
    }
  };

  const handleClockOut = () => {
    // Mock API call to clock out
    console.log('Clocking out...');
    setStatus('Not Clocked In');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Employee Dashboard</h2>

        <div className="mb-6 text-center">
          <p className="text-gray-700">Status: <span className={status === 'Clocked In' ? 'text-green-500' : 'text-red-500'}>{status}</span></p>
        </div>

        {lastClockIn && (
          <div className="mb-4 text-center">
            <p className="text-gray-500">Last Clock-In: {lastClockIn}</p>
            <p className="text-gray-500">Location: Latitude: {location.lat}, Longitude: {location.lon}</p>
          </div>
        )}

        <div className="flex justify-around mt-6">
          <button
            onClick={handleClockIn}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Clock In
          </button>

          <button
            onClick={handleClockOut}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clock Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
