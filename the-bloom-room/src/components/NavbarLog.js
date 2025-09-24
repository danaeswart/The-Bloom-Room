import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Navbar.css"; // ✅ Corrected path (relative to this file)
import logo from "../assets/images/logo.png"; // ✅ Ensure this path is correct

function NavbarLog({ user }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Left side - Logo */}
      <div className="navbar-logo">
        <img src={logo} alt="Logo" className="logo-img" />
      </div>

      {/* Right side - Links and login icon */}
      <div className="navbar-links">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/bloompost" className="nav-link">bloompost</Link>
      
  
   
        
        {/* Circular login icon */}
        <div className="login-icon" ><Link to="/profile"state={{ user }}>
          Account</Link>
        </div>
      </div>
    </nav>
  );
}

export default NavbarLog;
