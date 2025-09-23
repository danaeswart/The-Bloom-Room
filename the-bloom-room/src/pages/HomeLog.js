import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FlowerBackground from "../components/FlowerBackground";
import Navbar from "../components/Navbar";
import PostContainer from "../components/PostContainer"; 
import "./css/Home.css";
import NavbarLog from "../components/NavBarLog";

const HomeLog = () => {
  const { user_id } = useParams(); // matches your URL param
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user_id) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${user_id}`);
        setUser(res.data.user); // backend returns { user: {...} }
      } catch (err) {
        console.error("Error fetching user:", err.response?.data || err.message);
        // If user not found, navigate back to login
        navigate("/login");
      }
    };

    fetchUser();
  }, [user_id, navigate]);

  if (!user) return <div>Loading user info...</div>;

  return (
    <>
      <FlowerBackground />
      <NavbarLog />
      <div className="home-content">
        <h1>Welcome back, {user.name}!</h1> {/* Schema uses 'Name' */}
        <h2>Here's some art that's worth the watch:</h2>
        
        <div className="post-section">
          <PostContainer userId={user.User_ID} /> {/* pass user ID if needed */}
        </div>

        <button
          className="bloom-button"
          onClick={() => navigate(`/bloompost/${user.User_ID}`)}
        >
          Create a Bloom Post
        </button>
      </div>
    </>
  );
};

export default HomeLog;
