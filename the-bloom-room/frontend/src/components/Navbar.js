import React, { useState, useContext } from "react"; // <-- added useState for menu toggle
import { Link, useNavigate, useLocation  } from "react-router-dom";
import "./css/Navbar.css";
import logo from "../assets/images/logo.png";
import { useEffect } from "react";
import { UserContext } from "../context/UserContext";


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
const currentPath = location.pathname;
console.log("📍 Current path:", currentPath);



  // Prefer UserContext (keeps in sync while app runs). Fallback to localStorage for refresh.
  const { user: contextUser, setUser } = useContext(UserContext);

  let parsedLocalUser = null;
  try {
    const storedUser = localStorage.getItem("user");
    parsedLocalUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.warn("Failed to parse localStorage user:", e);
    parsedLocalUser = null;
  }

  // Final user: prefer context, fallback to localStorage
  const user = contextUser || parsedLocalUser || null;
  // remove noisy console logging in production; keep minimal

  // Normalize role (handle Role vs role casing differences)
  const rawRole = (user && (user.Role || user.role || user.roleName)) || null;
  const role = rawRole ? String(rawRole).toLowerCase() : null;

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

        

        {/* --- If no user logged in OR role unknown --- */}
        {(!user || !role) && (
          <>
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <div className="login-icon">
              <Link to="/login">Login / Sign Up</Link>
            </div>
          </>
        )}

        {/* --- If logged in as artist --- */}
        {user && role === "artist" && (
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
        {user && role === "buyer" && (
          <>
            <Link to="/homebuy" state={{ user }} className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <div className="login-icon">
              <Link to="/profilebuy" state={{ user }}>Account</Link>
            </div>
          </>
        )}
        {/* --- If logged in as admin --- */}
        {user && role === "admin" && (
          <>
            <Link to="/adminapproval" className="nav-link">Admin</Link>
            <div className="login-icon">
              <Link to="/profile" state={{ user }}>Account</Link>
            </div>
          </>
        )}

        {/* --- Logout for any logged-in user --- */}
        {user && (
          <button className="nav-logout" onClick={() => { setUser(null); localStorage.removeItem('user'); navigate('/login'); }}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
