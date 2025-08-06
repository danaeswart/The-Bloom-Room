import React, { useState } from "react";
import "./css/Login.css"; // Assuming you have a CSS file for styling
import { Link } from "react-router-dom"; // Import Link at the top

import FlowerBackground from "../components/FlowerBackground"; // Import the FlowerBackground component
function SignUp() {
  const [role, setRole] = useState("artist");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Role:", role, "Email:", email, "Password:", password);
    // Handle login logic here
  };

  return (
    <>
    <FlowerBackground />{/* Render the flower background */}
    <div className="login-container">
      
      <h2 className="login-title">Login</h2>

            {/* Role selection */}
        <div className="role-selection">
        <div className="role-option"  onClick={() => setRole("admin")}>
            <button
            className={`role-button ${role === "admin" ? "active" : ""}`}
            
            type="button"
            >
            As Admin
            </button>
        </div>
        <div className="role-option" onClick={() => setRole("artist")}>
            <button
            className={`role-button ${role === "artist" ? "active" : ""}`}
            
            type="button"
            >
            As Artist
            </button>
        </div>
        <div className="role-option"   onClick={() => setRole("buyer")}>
            <button
            className={`role-button ${role === "buyer" ? "active" : ""}`}
            
            type="button"
            >
            As Buyer
            </button>
        </div>
        </div>


      {/* Login form */}
      <form className="login-form" onSubmit={handleSubmit}>
       <label className="login-label">Email:</label>
        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
         <label className="login-label">Create Password:</label>
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
         <label className="login-label">Confirm Password:</label>
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Sign Up</button>
        <p className="signup-text">
    Already have an account?{" "}
    <Link to="/login" className="signup-link">
      Login
    </Link>
  </p>
      </form>
    </div>
     </>
  );
}

export default SignUp;
