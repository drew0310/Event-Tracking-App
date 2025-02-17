import React, { useState } from "react";
import axios from "axios";
import "./ProfileUpdate.css";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = ({ user, onClose, onUpdate }) => {
  const [updatedUser, setUpdatedUser] = useState({ 
    username: user.username,
    email: user.email,
    password: user.password
   });
  const [message, setMessage] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUpdatedUser({
      ...updatedUser,
      [e.target.name]: e.target.value
    });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        `https://event-tracking-app-production.up.railway.app/app/users/updateUser/${user.username}`,
        updatedUser,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setMessage("Profile updated successfully! Redirecting to login page...");
        setTimeout(() => {
          setMessage("");
          handleClose();
          onUpdate(updatedUser);
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className={`modal-overlay ${isClosing ? "fade-out" : ""}`}>
      <div className="form-card">
        <h2>Update Profile</h2>
        <div className="form-field">
          <label className="label-text">Username</label>
          <input
            type="text"
            name="username"
            value={updatedUser.username}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <label className="label-text">Email</label>
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <label className="label-text">Password</label>
          <input
            type="text"
            name="password"
            value={updatedUser.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-buttons">
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleClose}>Cancel</button>
        </div>
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default ProfileUpdate;
