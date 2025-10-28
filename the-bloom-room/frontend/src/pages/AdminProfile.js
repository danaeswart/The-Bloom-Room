import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";
import "./css/Profile.css";
import "./css/AdminProfile.css";
import flowerIcon from "../assets/images/profile-flower.png";

const AdminProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [profileUrl, setProfileUrl] = useState("");
  const [profileFile, setProfileFile] = useState(null);

  useEffect(() => {
    if (!user || user.Role !== 'admin') {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/home");
  };

  return (
    <>
      <Navbar />
      <div className="profile-card admin-profile">
        <div className="left-section">
          <div className="flower-section">
            <img src={flowerIcon} alt="Flower" />
            {profileUrl && (
              <div className="profile-pic-wrapper">
                <img
                  src={profileFile ? URL.createObjectURL(profileFile) : profileUrl}
                  alt="Admin Profile"
                  className="profile-pic"
                />
              </div>
            )}
          </div>
        </div>

        <div className="user-info">
          <div className="user-header">
            <div>
              <h2 className="user-name">
                {user?.Name} {user?.Surname}
                <span className="admin-badge">Admin</span>
              </h2>
              <p className="user-username">@{user?.Username}</p>
            </div>

            <div className="profile-buttons">
              <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminProfile;