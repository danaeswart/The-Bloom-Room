import React from "react";
import FlowerBackground from "../components/FlowerBackground";
import Navbar from "../components/Navbar";
import PostContainer from "../components/PostContainer"; // <-- Ensure this exists
import logo from "../assets/images/logo.png";
import "./css/Home.css";

const Home = () => {
  return (
    <>
      <FlowerBackground scroll={true} />
      <Navbar />
      <div className="home-content">
        <h1>Welcome to</h1>
        <img src={logo} alt="Logo" className="home-logo" />
        <button className="bloom-button">Create a Bloom Post</button>
        <div className="post-section">
          <PostContainer />
        </div>
      </div>
    </>
  );
};

export default Home;
