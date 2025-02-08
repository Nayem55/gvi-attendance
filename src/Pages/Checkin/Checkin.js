/* eslint-disable default-case */
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const CheckInPage = () => {
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCurrentTime = () => {
    const currentTime = dayjs().tz("Asia/Dhaka").format("hh:mm A");
    setTime(currentTime);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

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
    fetchCurrentTime();
    fetchUserLocation();
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing camera: ", error);
        alert("Could not access the camera.");
      }
    };

    startCamera();
  }, []);

  const handleCapture = async () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "capture.png");

      setLoading(true);

      try {
        const response = await axios.post(
          "https://api.imgbb.com/1/upload?expiration=172800&key=293a0c42ccc6a11a4d90a9b7974dbb60",
          formData
        );
        const imageUrl = response.data.data.url;
        setImage(imageUrl);
        setCaptured(true);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error("Failed to upload image.");
      } finally {
        setLoading(false);
      }
    }, "image/png");
  };

  const handleRetake = () => {
    setImage(null);
    setCaptured(false);
    canvasRef.current.style.display = "none";
  };

  const handleCheckIn = async () => {
    if (!isLocationEnabled) {
      toast.error("Location is required. Please enable location to check-in.");
      return;
    }

    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const checkInTime = dayjs().tz("Asia/Dhaka").format("YYYY-MM-DD HH:mm:ss");
    const checkInHour = dayjs(checkInTime).hour();
    const checkInMinute = dayjs(checkInTime).minute();

    const location = await fetchUserLocation();

    const status =
      checkInHour > 11 || (checkInHour === 11 && checkInMinute > 0)
        ? "Late"
        : "Success";

    try {
      const response = await axios.post(
        "https://attendance-app-server-blue.vercel.app/checkin",
        {
          userId: user?._id,
          note,
          image,
          time: checkInTime,
          date: dayjs().tz("Asia/Dhaka").format("YYYY-MM-DD"),
          status,
          location,
        }
      );

      user.checkIn = true;
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(response.data.message);
      navigate("/home");
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "Error during check-in"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const checkOutTime = dayjs().tz("Asia/Dhaka").format("YYYY-MM-DD HH:mm:ss");
    const checkOutHour = dayjs(checkOutTime).hour();
    const checkOutMinute = dayjs(checkOutTime).minute();

    const location = await fetchUserLocation();

    const status =
      checkOutHour > 22 || (checkOutHour === 22 && checkOutMinute >= 0)
        ? "Overtime"
        : "Success";

    try {
      const response = await axios.post(
        "https://attendance-app-server-blue.vercel.app/checkout",
        {
          userId: user?._id,
          note,
          image,
          time: checkOutTime,
          date: dayjs().tz("Asia/Dhaka").format("YYYY-MM-DD"),
          status,
          location,
        }
      );

      user.checkIn = false;
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(response.data.message);
      navigate("/home");
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "Error during check-out"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 py-10 pb-16 mb-10">
      <h2 className="text-2xl font-semibold text-center mb-4">Attendance</h2>
      <div className="mb-6">
        {!captured && (
          <>
            <label className="block text-lg font-medium mb-2">
              Capture Image:
            </label>
            <video
              ref={videoRef}
              autoPlay
              className={`w-full h-auto border border-gray-300 rounded-lg`}
            ></video>
          </>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        {/* {!captured ? (
          <button
            onClick={handleCapture}
            className="w-full mt-4 bg-[#F16F24] text-white py-2 rounded-lg"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Please wait..." : "Capture Image"}
          </button>
        ) : (
          <button
            onClick={handleRetake}
            className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg"
          >
            Retake
          </button>
        )} */}
        <button
          onClick={handleCapture}
          className="w-full mt-4 bg-[#F16F24] text-white py-2 rounded-lg"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Please wait..." : "Capture Image"}
        </button>
        {image && <img src={image} alt="Captured Check-In" className="mt-2" />}
      </div>
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">
          Note (Optional):
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add any note for your check-in..."
          className="w-full p-2 border border-gray-300 rounded-lg"
          rows="4"
        />
      </div>
      <div className="mb-6">
        <table className="w-full table-auto">
          <tbody>
            <tr>
              <td className="p-2">Current Date</td>
              <td className="p-2">{dayjs().format("DD MMMM YYYY")}</td>
            </tr>
            <tr>
              <td className="p-2">Current Time</td>
              <td className="p-2">{time}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-center">
        {user && user?.checkIn ? (
          <button
            className={`w-full text-white py-2 px-4 rounded-lg mt-2 ${
              !isLocationEnabled ? "bg-[#cccccc]" : "bg-[#F16F24]"
            }`}
            onClick={handleCheckOut}
            disabled={loading || !isLocationEnabled}
          >
            {loading
              ? "Please wait..."
              : !isLocationEnabled
              ? "Please turn on your location"
              : "Check Out"}
          </button>
        ) : (
          <button
            className={`w-full text-white py-2 px-4 rounded-lg mt-2 ${
              !isLocationEnabled ? "bg-[#cccccc]" : "bg-[#F16F24]"
            }`}
            onClick={handleCheckIn}
            disabled={loading || !isLocationEnabled}
          >
            {loading
              ? "Please wait..."
              : !isLocationEnabled
              ? "Please turn on your location"
              : "Check In"}
          </button>
        )}
        {!isLocationEnabled && (
          <button
            onClick={() => {
              fetchUserLocation(); // Re-fetch user location
            }}
            className="mt-2 font-bold py-1 px-2 text-black rounded"
          >
            I have turned on location
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckInPage;
