import React, { useState } from "react"; // <-- added useState for menu toggle
import { Link, useNavigate, useLocation  } from "react-router-dom";
import "./css/Navbar.css";
import logo from "../assets/images/logo.png";
import { useEffect } from "react";


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
const currentPath = location.pathname;
console.log("📍 Current path:", currentPath);



  // Get user from localStorage
  const storedUser = localStorage.getItem("user");
  
  // console.log("🌐 Stored user from localStorage:", storedUser);
  const user = storedUser ? JSON.parse(storedUser) : null;
  console.log("user:", user, "currentPath:", currentPath);

  // console.log("🧠 Current user:", user);


  const [menuOpen, setMenuOpen] = useState(false); // <-- new state to handle mobile menu toggle

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



 {/* Hamburger icon for mobile */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)} // <-- toggles menu open/close
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    

      {/* Right side - Links */}
      <div className={`navbar-links ${menuOpen ? "mobile-open" : ""}`}>
        {/* --- Feed link visible to everyone --- */}
        <Link to="/feed" className="nav-link">Feed</Link>

        

        {/* --- If no user logged in --- */}
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
