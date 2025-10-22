import React, { useState, useContext } from "react";
import "./css/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import { BASE_URL } from "../Config"; // ✅ import BASE_URL
import axios from "axios";
import { UserContext } from "../context/UserContext"; // ✅ Import context
import flower1 from "../assets/images/flower-red.png"; 
import flower2 from "../assets/images/flower-blue.png"; 
import flower3 from "../assets/images/flower-green.png"; 
import flower4 from "../assets/images/flower-pink.png"; 


function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [role, setRole] = useState("buyer");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // ✅ Add context

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordMatch(value === confirmPassword);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      alert("Passwords do not match!");
      return;
    }

    try {
     const res = await axios.post(
  `${BASE_URL}/auth/signup`,
  { email, password, username, name, surname, role }
, { withCredentials: true });

      console.log("Signup success:", res.data);
      alert("Account created successfully!");

      // ✅ Store user globally instead of passing state
      const newUser = {
        User_ID: res.data.user.id,
        Email: email,
        Username: username,
        Name: name,
        Surname: surname,
        Role: role,
      };
      setUser(newUser);
      // After setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser));


      // Redirect depending on role
      if (role === "artist") {
        navigate("/homelog");
      }
      else if (role === "buyer") {
        navigate("/homebuy");
      }
      else {
        navigate("/"); // Change to wherever you want other roles to go
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <>
     
      <NavBar />
      <div className="login-container">

        <h2 className="login-title">Sign Up</h2>

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

        {/* Signup form */}
        <form className="login-form" onSubmit={handleSignup}>
          <div className="form-columsn-container">
            <div className="form-column">
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
                <label className="login-label">Name:</label>
                <input
                  type="text"
                  placeholder="Name"
                  className="login-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-holder">
                <label className="login-label">Surname:</label>
                <input
                  type="text"
                  placeholder="Surname"
                  className="login-input"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-column">
              <div className="input-holder">
                <label className="login-label">Username:</label>
                <input
                  type="text"
                  placeholder="Username"
                  className="login-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="input-holder">
                <label className="login-label">Create Password:</label>
                <input
                  type="password"
                  placeholder="Password"
                  className="login-input"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                />
              </div>

              <div className="input-holder">
                <label className="login-label">Confirm Password:</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={`login-input ${!passwordMatch ? "input-error" : ""}`}
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  required
                />
                {!passwordMatch && (
                  <p className="password-warning">Passwords do not match!</p>
                )}
              </div>
            </div>
          </div>

          <div className="form-submit-section">
            <button
              type="submit"
              className="login-button"
              disabled={!passwordMatch}
            >
              Sign Up
            </button>
            <p className="signup-text">
              Already have an account?{" "}
              <Link to="/login" className="signup-link">
                Login
              </Link>
            </p>
          </div>

        </form>

        
        {/* Flower Decorations */}
<img src={flower1} alt="Flower 1" className="flower flower1" />
<img src={flower2} alt="Flower 2" className="flower flower2" />
<img src={flower3} alt="Flower 3" className="flower flower3" />
<img src={flower4} alt="Flower 4" className="flower flower4" />

      </div>
    </>
  );
}

export default SignUp;
