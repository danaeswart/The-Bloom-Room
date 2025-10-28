import React from "react";
import { Link } from "react-router-dom";
import "./css/Footer.css";
import logo from "../assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={logo} alt="Bloom Room" className="footer-logo" />
          <div className="brand-text">
            <h3>Bloom Room</h3>
            <p>Where ideas take root and art blossoms.</p>
          </div>
        </div>

        <nav className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/feed">Feed</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/login">Log In</Link>
        </nav>

        <div className="footer-legal">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Bloom Room. All rights reserved.</p>
        <p className="disclaimer">
          This site is a student project. All T&Cs and policies are mock content for demonstration purposes.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
