// import React, { useEffect } from "react";

import Navbar from "../components/Navbar";
import PostContainer from "../components/PostContainer"; 
import logo from "../assets/images/logo.png";
import "./css/Home.css";
import flower1 from "../assets/images/flower-red.png"; 
import flower2 from "../assets/images/flower-blue.png"; 
import flower3 from "../assets/images/flower-green.png"; 
import flower4 from "../assets/images/flower-pink.png"; 
import { useEffect, useRef } from "react";
import About from "./About";
import AboutBloomRoom from "../components/AboutBloomRoom";

import Footer from "../components/Footer";


const Home = () => {
  const nextSectionRef = useRef(null);

  // Clear user from localStorage on render
  useEffect(() => {
    localStorage.removeItem("user"); // this sets user to null
  }, []); // runs only once on mount


  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const flowers = document.querySelectorAll(".flower");

      flowers.forEach((flower, index) => {
        // Move faster than scroll speed (parallax effect)
        let speed = (index + 1) * 0.3; // each flower has different speed
        flower.style.transform = `translateY(${-scrollY * speed}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <div className="home-background">
        <img src={flower1} alt="Flower 1" className="flower flower1" />
        <img src={flower2} alt="Flower 2" className="flower flower2" />
        <img src={flower3} alt="Flower 3" className="flower flower3" />
        <img src={flower4} alt="Flower 4" className="flower flower4" />
          
      </div>

      <div className="home-content">
       <h1>Welcome to</h1>
        <img src={logo} alt="Logo" className="home-logo" />
        <button
          className="bloom-button"
          type="button"
          onClick={() => {
            if (nextSectionRef.current) {
              const targetImg = nextSectionRef.current.querySelector(
                ".hero-image img, .buyer-image img, .hero-section img"
              );
              if (targetImg) {
                targetImg.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
              } else {
                nextSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }
          }}
        >
          Step into the Bloom Room
        </button>

      <div className="about-bloom" ref={nextSectionRef}>
           <AboutBloomRoom />
      </div>
     

        <div className="post-section">
          <PostContainer />
        </div>

        {/* <About/> */}

      </div>
      {/* <About /> */}
      <Footer />
    </>
  );
};

export default Home;
