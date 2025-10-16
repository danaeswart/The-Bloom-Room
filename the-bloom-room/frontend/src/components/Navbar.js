import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Navbar.css";
import logo from "../assets/images/logo.png";

function Navbar() {
  const navigate = useNavigate();

  // Get user from localStorage
  const storedUser = localStorage.getItem("user");
  // console.log("🌐 Stored user from localStorage:", storedUser);
  const user = storedUser ? JSON.parse(storedUser) : null;

  // console.log("🧠 Current user:", user);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Left side - Logo */}
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" className="logo-img" />
      </div>

      {/* Right side - Links */}
      <div className="navbar-links">
        {/* --- Feed link visible to everyone --- */}
        <Link to="/feed" className="nav-link">Feed</Link>

        {/* --- If no user logged in --- */}
        {!user && (
          <>
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <div className="login-icon">
              <Link to="/login">Login / Sign Up</Link>
            </div>
          </>
        )}

        {/* --- If logged in as artist --- */}
        {user && user.Role === "artist" && (
          <>
            <Link to="/homelog" state={{ user }} className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/bloompost" state={{ user }} className="nav-link">Bloompost</Link>
            <div className="login-icon">
              <Link to="/profile" state={{ user }}>Account</Link>
            </div>
          </>
        )}

        {/* --- If logged in as buyer --- */}
        {user && user.Role === "buyer" && (
          <>
            <Link to="/homebuy" state={{ user }} className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <div className="login-icon">
              <Link to="/profilebuy" state={{ user }}>Account</Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
