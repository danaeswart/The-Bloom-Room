import React, { useContext } from "react"; // ✅ need useContext

import PostContainer from "../components/PostContainer"; 
import logo from "../assets/images/logo.png";
import "./css/Home.css";
import NavbarLog from "../components/NavbarLog";
import { UserContext } from "../context/UserContext"; // ✅ import context
import Navbar from "../components/Navbar";
const HomeLog = () => {
  const { user } = useContext(UserContext); // ✅ pull from global context
  console.log("HomeLog user from context:", user);
  return (
    <>
     
      {/* <NavbarLog user={user} /> */}
      <Navbar />
      <div className="home-content">
        <h1>Welcome Home, {user?.Name || "Guest"}</h1>
        <h2>Here's some art that's worth the watch:</h2>

        <div className="post-section">
          {/* <PostContainer  /> */}
        </div>

        <button className="bloom-button">Create a Bloom Post</button>
      </div>
    </>
  );
};

export default HomeLog;
