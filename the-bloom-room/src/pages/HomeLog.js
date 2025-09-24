import React from "react";
import FlowerBackground from "../components/FlowerBackground";
import { useLocation } from "react-router-dom";
import PostContainer from "../components/PostContainer"; // <-- Ensure this exists
import logo from "../assets/images/logo.png";
import "./css/Home.css";
import NavbarLog from "../components/NavbarLog";

const HomeLog = () => {
  const location = useLocation();
  const user = location.state?.user;


  return (
    <>
      <FlowerBackground />
      <NavbarLog user={user} />
      <div className="home-content">
        <h1>Welcome Home, {user?.Name}</h1>
       <h2>Heres some art thats worth the watch:</h2>

        <div className="post-section">
          <PostContainer />
        </div>
                <button className="bloom-button">Create a Bloom Post</button>
      </div>
    </>
  );
};

export default HomeLog;
