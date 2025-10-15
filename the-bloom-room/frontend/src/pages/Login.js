import React, { useState, useContext } from "react";
import "./css/Login.css";
import NavBar from "../components/Navbar";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // ✅ import context

function Login() {
  const [role, setRole] = useState("artist");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // ✅ use context properly
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("https://the-bloom-room-5.onrender.com/auth/login", {
      email,
      password,
      role,
    });

    const user = res.data.user;
    console.log("Logged in user:", user);

    alert(`Welcome back, ${user.Username}!`);
    setUser(user);
    setRole(user.role); // Just to be sure
    localStorage.setItem("user", JSON.stringify(user)); // Save user to localStorage
    

    if (role === "artist") {
      navigate("/homelog");
    } else if (role === "buyer") {
      navigate("/homebuy"); // ✅ buyer route
    } else if (role === "admin") {
      navigate("/adminhome"); // optional: admin route
    } else {
      alert("Unknown role");
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert(err.response?.data?.message || "Login failed!");
  }
};

  return (
    <>
    
      <NavBar />
      <div className="login-container">
        <h2 className="login-title">Login</h2>

        {/* Role selection */}
        <div className="role-selection">
          <div className="role-option" onClick={() => setRole("admin")}>
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
          <div className="role-option" onClick={() => setRole("buyer")}>
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
          <div className="input-value-container">
            <div className="input-holder">
              <label className="login-label">Email:</label>
              <input
                type="email"
                placeholder="Email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-holder">
              <label className="login-label">Password:</label>
              <input
                type="password"
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button">Login</button>
          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;
