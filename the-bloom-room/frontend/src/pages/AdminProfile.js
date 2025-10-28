import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
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
        <Helmet>
          <title>Admin Profile | The Bloom Room</title>
          <meta name="description" content="Admin profile management for The Bloom Room art marketplace." />
          <meta name="keywords" content="admin, profile, management, The Bloom Room, art, artists" />
          <meta name="author" content="The Bloom Room Team" />
          <meta property="og:title" content="Admin Profile | The Bloom Room" />
          <meta property="og:description" content="Admin profile management for The Bloom Room art marketplace." />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/bloomroom-og-image.jpg" />
          <meta property="og:url" content="https://thebloomroom.com/admin-profile" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Admin Profile | The Bloom Room" />
          <meta name="twitter:description" content="Admin profile management for The Bloom Room art marketplace." />
          <meta name="twitter:image" content="/bloomroom-og-image.jpg" />
        </Helmet>
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