/* eslint-disable default-case */
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import timezone from "dayjs/plugin/timezone";
import axios from "axios";

dayjs.extend(duration);
dayjs.extend(timezone);

const HomePage = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [totalWorkingHours, setTotalWorkingHours] = useState("00:00:00");
  const [totalCheckIns, setTotalCheckIns] = useState(0);
  const [lateCheckIns, setLateCheckIns] = useState(0);
  const [lateCheckOuts, setLateCheckOuts] = useState(0);
  const [user, setUser] = useState({});
  const [dataLoading, setDataLoading] = useState(false);
  const [AbsentCount, setAbsentCount] = useState(0);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentMonth = dayjs().format("MMMM");
  const currentYear = dayjs().format("YYYY");
  const [locationError, setLocationError] = useState("");
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!storedUser) return;

    try {
      const [userResponse, checkInsResponse, checkOutResponse] =
        await Promise.all([
          axios.get(
            `https://attendance-app-server-blue.vercel.app/getUser/${storedUser?._id}`
          ),
          axios.get(
            `https://attendance-app-server-blue.vercel.app/api/checkins/${storedUser?._id}?month=${currentMonth}&year=${currentYear}`
          ),
          axios.get(
            `https://attendance-app-server-blue.vercel.app/api/checkouts/${storedUser?._id}?month=${currentMonth}&year=${currentYear}`
          ),
        ]);

      const userData = userResponse.data;
      const checkins = checkInsResponse.data;
      const checkouts = checkOutResponse.data;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setTotalCheckIns(checkins.length);

      // Calculate late check-ins (after 10:15 AM)
      // const lateCheckInsCount = checkins.filter((checkin) => {
      //   const checkInTime = dayjs(checkin.time);
      //   const lateThreshold = dayjs(
      //     checkInTime.format("YYYY-MM-DD") + "10:15:00"
      //   );
      //   return checkInTime.isAfter(lateThreshold);
      // }).length;
      const lateCheckInsCount = checkins.filter(
        (checkin) => checkin.status === "Late"
      ).length;
      const lateCheckOutsCount = checkouts.filter(
        (checkin) => checkin.status === "Overtime"
      ).length;
      const AbsentCount = checkins.filter(
        (checkin) => checkin.status === "Absent"
      ).length;

      setLateCheckIns(lateCheckInsCount);
      setLateCheckOuts(lateCheckOutsCount);
      setAbsentCount(AbsentCount);
      setIsCheckedIn(userData.checkIn && userData.lastCheckedIn);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setDataLoading(false);
    }
  }, [storedUser]);

  const fetchUserLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
          setIsLocationEnabled(true); // Set location enabled if successful
        },
        (error) => {
          let errorMessage = "An unknown error occurred.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please allow location permissions.";
              setLocationError(errorMessage); // Set the error message
              setIsLocationEnabled(false); // Set location as not enabled
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              setLocationError(errorMessage); // Set the error message
              setIsLocationEnabled(false); // Set location as not enabled
              break;
            case error.TIMEOUT:
              errorMessage = "Request timed out. Please try again.";
              setLocationError(errorMessage); // Set the error message
              setIsLocationEnabled(false); // Set location as not enabled
              break;
          }
          reject(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
    } else {
      fetchUserData();
      fetchUserLocation();
    }
  }, []);

  useEffect(() => {
    let intervalId;

    if (isCheckedIn && user?.lastCheckedIn) {
      const calculateActiveTime = () => {
        const checkInTime = dayjs(user?.lastCheckedIn);
        const currentTime = dayjs();
        const duration = dayjs.duration(currentTime.diff(checkInTime));

        const hours = duration.hours().toString().padStart(2, "0");
        const minutes = duration.minutes().toString().padStart(2, "0");
        const seconds = duration.seconds().toString().padStart(2, "0");

        setTotalWorkingHours(`${hours}:${minutes}:${seconds}`);
      };

      calculateActiveTime();
      intervalId = setInterval(calculateActiveTime, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isCheckedIn, user]);

  return (
    <div className="p-6 py-10 pb-16 bg-[#F2F2F2]">
      <div className="p-4 rounded-md mb-6 bg-white shadow-md">
        <p className="text-xl text-[#000] font-semibold">Reminder</p>
        <Link
          to="/check-in"
          className="sm:w-auto bg-[#F16F24] text-white py-2 px-4 rounded-lg mt-2 block text-center font-bold"
        >
          {user?.checkIn ? "Complete Your Checkout" : "Complete Your Check-in"}
        </Link>
      </div>

      <div className="bg-[#ffffff] p-4 rounded-lg shadow-md pb-10">
        <p className="text-xl text-[#000] font-semibold mb-4">Summary</p>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SummaryCard
            title={`${currentMonth} Attendance`}
            value={
              dataLoading
                ? "Calculating..."
                : `${totalCheckIns - AbsentCount} Days`
            }
          />
          <SummaryCard
            title={`${currentMonth} Late`}
            value={
              dataLoading
                ? "Calculating..."
                : `${lateCheckIns} Days`
            }
          />
          {/* <SummaryCard
            title={`${currentMonth} Absent`}
            value={AbsentCount}
          /> */}
          <SummaryCard
            title="Today's Status"
            value={user?.checkIn ? "Checked In" : "Not Checked In"}
          />
          <SummaryCard
            title="Today's In Time"
            value={
              user?.checkIn
                ? dayjs(user?.lastCheckedIn).tz("Asia/Dhaka").format("hh:mm A")
                : "00:00:00"
            }
          />
        </div>

        <div className="p-4 rounded-lg mt-6 bg-[#F16F24] text-white">
          <h4 className="font-bold">Total Working Hours</h4>
          <p className="text-xl mt-4 font-semibold">{totalWorkingHours}</p>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value }) => (
  <div className="p-4 bg-white border border-[#cfcfcf] rounded-lg flex flex-col justify-center items-center text-center mx-auto sm:w-full">
    <h4 className="font-semibold">{title}</h4>
    <p className="text-xl mt-4">{value}</p>
  </div>
);

export default HomePage;
