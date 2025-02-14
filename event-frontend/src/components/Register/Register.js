import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import "./Register.css"; 

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const formattedDate = now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      setCurrentTime(`It is now ${formattedTime} on ${formattedDate}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Username is required.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "A valid email is required.";
    if (!password || password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
      newErrors.password = "Password must be at least 8 characters long, include at least 1 digit, and 1 special character.";
    }
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Call backend API
        const response = await axios.post("http://localhost:8080/app/users/addUser", formData); 
        if (response.status === 201) {
          setSuccessMessage("Registration successful! Redirecting back to landing page...");
          setTimeout(() => navigate("/"), 3000); 
        }
      } catch (error) {
        if (error.response?.status === 409) {
          setErrors({ username: "Username already exists." });
        } else {
          setErrors({ general: "Oops! An unexpected error occurred. Please try again later." });
        }
      }
    }
  };

  return (
    <div className="register-page">
      <h1 className="app-title">Planify</h1>
      <p className="current-time">{currentTime}</p>
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register New User</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
        {errors.username && <p className="error">{errors.username}</p>}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <button type="submit" className="submit-button">
          Register
        </button>

        {successMessage && (
          <p className="success-message">
            {successMessage}
          </p>
        )}

        {errors.general && <p className="error general-error">{errors.general}</p>}
      </form>
    </div>
  );
};

export default Register;
