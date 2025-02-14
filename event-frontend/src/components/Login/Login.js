import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import "./Login.css"; 

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [currentTime, setCurrentTime] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
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
    const { username, password } = formData;
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Username is required.";
    if (!password || password.length < 8) newErrors.password = "Password must be at least 8 characters long.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setForgotPasswordMessage(""); 
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:8080/app/users/login", formData);
        if (response.status === 200) {
          setSuccessMessage("Login successful! Redirecting to user home page...");
          setTimeout(() => navigate(`/home/${formData.username}`), 3000); 
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setErrors({ general: "Invalid username or password. Please register first if you do not have an account, and try again!" });
        } else {
          setErrors({ general: "Oops! An unexpected error occurred. Please try again later." });
        }
      }
    }
  };

  const handleForgotPassword = async () => {
    setSuccessMessage(""); 

    if (!formData.username.trim()) {
      setErrors({ username: "Please enter your username to retrieve your password." });
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/app/users/forgot-password/${formData.username}`, {
        username: formData.username,
      });

      if (response.status === 200) {
        setForgotPasswordMessage("A mail containing your account password has been sent to your email ID, please check.");
        setErrors({}); 
      }

      
    } catch (error) {
      setForgotPasswordMessage("");
      setErrors({ general: "Error retrieving password. Please register first if you do not have an account, or try again later." });
    }
  };

  return (
    <div className="login-page">
      <h1 className="app-title">Planify</h1>
      <p className="current-time">{currentTime}</p>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>User Login</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
        {errors.username && <p className="error">{errors.username}</p>}

        
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}
        <br></br><br></br>
      
        <button type="submit" className="submit-button">
          Login
        </button>

        
        <button type="button" className="forgot-password-button" onClick={handleForgotPassword}>
          Forgot Password?
        </button>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {forgotPasswordMessage && <p className="success-message">{forgotPasswordMessage}</p>}
        {errors.general && <p className="general-error">{errors.general}</p>}
      </form>
    </div>
  );
};

export default Login;
