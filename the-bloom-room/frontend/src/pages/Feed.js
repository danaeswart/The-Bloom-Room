import React, { useEffect, useState } from "react";
import PostContainer from "../components/PostContainer";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./css/Feed.css";
import flower1 from "../assets/images/flower-red.png";
import flower2 from "../assets/images/flower-blue.png";
import flower3 from "../assets/images/flower-green.png";
import flower4 from "../assets/images/flower-pink.png";

const Feed = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const flowers = document.querySelectorAll(".flower");
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      flowers.forEach((flower, index) => {
        const speed = 0.5 + index * 0.4;
        flower.style.transform = `translateY(${-scrollTop * speed}px)`;
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="feed-page">
      <Navbar />
      <div className="feed-background">
        <img src={flower1} alt="flower" className="flower flower1" />
        <img src={flower2} alt="flower" className="flower flower2" />
        <img src={flower3} alt="flower" className="flower flower3" />
        <img src={flower4} alt="flower" className="flower flower4" />
      </div>
      <header className={`feed-header ${fadeIn ? "visible" : ""}`}>
        <h1>Welcome to the Bloom Room Feed </h1>
        <p>
          This is your free space to share creativity, inspiration, and ideas.
          Post anything. Your art, thoughts, or moments that spark joy.
        </p>
      </header>

      <div className="feed-container">
        <PostContainer />
      </div>
      <Footer />
    </div>
  );
};

export default Feed;