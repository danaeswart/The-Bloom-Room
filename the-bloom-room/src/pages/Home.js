import React from "react";
import FlowerBackground from "../components/FlowerBackground";
import Navbar from "../components/Navbar";
import PostContainer from "../components/PostContainer"; // <-- Ensure this exists
import logo from "../assets/images/logo.png";
import "./css/Home.css";
import flower1 from "../assets/images/flower-red.png"; 
import flower2 from "../assets/images/flower-blue.png"; 
import flower3 from "../assets/images/flower-green.png"; 
import flower4 from "../assets/images/flower-lightgreen.png"; // Example image, ensure this exists

const Home = () => {
  return (
    <>
      {/* <FlowerBackground scroll={true} /> */}
      <Navbar />
      <div className="home-background">
        <img src={flower1} alt="Flower 1" className="flower flower-top-left" />
        <img src={flower2} alt="Flower 2" className="flower flower-top-right" />
        <img src={flower3} alt="Flower 3" className="flower flower-bottom-left" />
        <img src={flower4} alt="Flower 4" className="flower flower-bottom-right" />
        </div>
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
