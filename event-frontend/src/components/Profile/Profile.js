import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import ProfileUpdate from "../ProfileUpdate/ProfileUpdate";

const Profile = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/app/users/fetchUserByUsername/${username}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
    setIsModalOpen(false);
  };

  const handleDeleteProfile = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/app/users/deleteUser/${username}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if(response.status === 200) {
        setDeleteMessage("Profile deleted successfully!");
        setTimeout(() => {
          setDeleteMessage("");
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Error deleting user profile:", error);
      setDeleteMessage("Failed to delete profile. Please try again.");
    }
  }

  return (
    <div className="profile-page">
      <Navbar username={username} />
      <h1>Your Profile</h1>
      <div className="profile-info">
        <label>Username:</label>
        <p>{user.username}</p>
      </div>
      <div className="profile-info">
        <label>Email:</label>
        <p>{user.email}</p>
      </div>
      <div className="profile-info">
        <label>Password:</label>
        <p>{user.password}</p>
      </div>

      <div className="profile-actions">
        <button className="edit-btn" onClick={() => setIsModalOpen(true)}>
          Update Profile
        </button>
        <button className="delete-btn" onClick={handleDeleteProfile}>
          Delete Profile
        </button>
      </div>

      {deleteMessage && <div className="delete-msg">{deleteMessage}</div>}

      {isModalOpen && (
        <div className="modal-overlay">
          <ProfileUpdate
            user={user}
            onClose={() => setIsModalOpen(false)}
            onUpdate={handleUpdateProfile}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;

