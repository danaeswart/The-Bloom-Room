import React, { useContext, useEffect } from "react"; // ✅ need useContext

import PostContainer from "../components/PostContainer"; 
import logo from "../assets/images/logo.png";
import "./css/Home.css";

import { UserContext } from "../context/UserContext"; // ✅ import context
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import flower1 from "../assets/images/flower-red.png";
import flower2 from "../assets/images/flower-blue.png";
import flower3 from "../assets/images/flower-green.png";
import flower4 from "../assets/images/flower-pink.png";

const HomeBuy = () => {
  const { user } = useContext(UserContext); // ✅ pull from global context
  console.log("HomeBuy user from context:", user);

  useEffect(() => {
    const flowers = document.querySelectorAll(".flower");

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      flowers.forEach((flower, index) => {
        const speed = 0.5 + index * 0.4; // match Home speeds
        flower.style.transform = `translateY(${-scrollTop * speed}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />

      <div className="home-background">
        <img src={flower1} alt="flower" className="flower flower1" />
        <img src={flower2} alt="flower" className="flower flower2" />
        <img src={flower3} alt="flower" className="flower flower3" />
        <img src={flower4} alt="flower" className="flower flower4" />
      </div>

      <div className="home-content">
        <h1>Welcome Home Buy, {user?.Name || "Guest"}</h1>
        <h2>Here's some art that's worth the watch:</h2>

        <div className="post-section">
          <PostContainer />
        </div>

      </div>

      <Footer />
    </>
  );
};

export default HomeBuy;
