import React from "react";
import FlowerBackground from "../components/FlowerBackground";
import Navbar from "../components/Navbar";
import PostContainer from "../components/PostContainer"; // <-- Ensure this exists
import logo from "../assets/images/logo.png";
import "./css/Home.css";
import NavbarLog from "../components/NavBarLog";

const Home = () => {
  return (
    <>
      <FlowerBackground />
      <NavbarLog />
      <div className="home-content">
        <h1>Welcome back, Danae</h1>
       <h2>Heres some art thats worth the watch:</h2>

        <div className="post-section">
          <PostContainer />
        </div>
                <button className="bloom-button">Create a Bloom Post</button>
      </div>
    </>
  );
};

export default Home;
