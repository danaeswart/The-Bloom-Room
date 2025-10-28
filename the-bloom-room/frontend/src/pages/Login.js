import React, { useState, useContext } from "react";
import "./css/Login.css";
import NavBar from "../components/Navbar";
import axios from "axios";
// import { BASE_URL } from "../Config"; // ✅ import BASE_URL
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // ✅ import context
import flower1 from "../assets/images/flower-red.png"; 
import flower2 from "../assets/images/flower-blue.png"; 
import flower3 from "../assets/images/flower-green.png"; 
import flower4 from "../assets/images/flower-pink.png"; 


const BASE_URL= "https://the-bloom-room-5.onrender.com";

function Login() {

    

  const [role, setRole] = useState("artist");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // ✅ use context properly
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
      role,
    }, { withCredentials: true });

    const user = res.data.user;

    // alert(`Welcome back, ${user.Username}!`);
    setUser(user);
    // store user
    localStorage.setItem("user", JSON.stringify(user)); // Save user to localStorage

    // Prefer role from returned user object but fall back to current selected role
    const returnedRole = user.Role || user.role || role;

    if (returnedRole === "artist") {
      navigate("/homelog");
    } else if (returnedRole === "buyer") {
      navigate("/homebuy");
    } else if (returnedRole === "admin") {
      // navigate admin users to the admin approval dashboard
      navigate("/adminapproval");
    } else {
      // unknown role: fall back to home
      navigate("/");
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
          {/* Flower Decorations */}
         <img src={flower1} alt="Flower 1" className="flower flower1" />
         <img src={flower2} alt="Flower 2" className="flower flower2" />
         <img src={flower3} alt="Flower 3" className="flower flower3" />
         <img src={flower4} alt="Flower 4" className="flower flower4" />
         


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
