import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Import react-hot-toast
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Dynamic validation for all fields
  const validateField = (name, value) => {
    if (!value.trim()) return `${name} is required`;

    switch (name) {
      case "number":
        if (value.length !== 11 || !/^\d+$/.test(value)) {
          return "Invalid phone number! Enter a 10-digit number.";
        }
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          return "Invalid email format!";
        }
        break;
      case "password":
        if (value.length < 6) {
          return "Password must be at least 6 characters long.";
        }
        break;
      default:
        return null;
    }
    return null;
  };

  // Validate all fields
  const validateForm = () => {
    const errors = Object.keys(formData).map((key) =>
      validateField(key, formData[key])
    );
    const firstError = errors.find((error) => error);

    if (firstError) {
      toast.error(firstError, { position: "top-right" });
      return false;
    }
    return true;
  };

  // Handle signup submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://attendance-app-server-blue.vercel.app/signup",
        formData
      );

      // Ensure user data is available in the response
      if (response.data.user) {
        const user = response.data.user; // Assuming the response includes a user object
        localStorage.setItem("user", JSON.stringify(user));

        // Show success toast
        toast.success(response.data.message || "Signup successful!", {
          position: "top",
          duration: 3000,
        });

        setIsLoading(false);

        // Redirect to the home page
        navigate("/home");
      } else {
        throw new Error("User data not found in response.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage, { position: "top", duration: 3000 });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg mx-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#F16F24]">
          Create an Account
        </h2>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F16F24]"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F16F24]"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F16F24]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F16F24]"
              placeholder="Enter your password (min 6 characters)"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 bg-[#F16F24] text-white font-semibold rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-[#F16F24]"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-500">
            Already have an account?{" "}
          </span>
          <a
            href="/login"
            className="text-sm text-[#F16F24] hover:text-blue-600"
          >
            Login here
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
