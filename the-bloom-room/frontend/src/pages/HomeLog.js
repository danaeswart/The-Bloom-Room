import React, { useContext, useEffect } from "react"; 
import PostContainer from "../components/PostContainer"; 
import "./css/HomeLog.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";
import flower1 from "../assets/images/flower-red.png";
import flower2 from "../assets/images/flower-blue.png";
import flower3 from "../assets/images/flower-green.png";
import flower4 from "../assets/images/flower-pink.png";
import { Link } from "react-router-dom";
import AboutBloomRoom from "../components/AboutBloomRoom";
const HomeLog = () => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    const flowers = document.querySelectorAll(".flower");

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      flowers.forEach((flower, index) => {
        const speed = 0.5 + index * 0.4; // different speed for each flower
        flower.style.transform = `translateY(${-scrollTop * speed}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>
      <Navbar />

      <div className="home-content">
        <h1 className="fade-up">Hi {user?.Name || "Guest"} </h1>
        <h2 className="fade-up delay-1">Feeling inspired today?</h2>

       <Link to="/bloompost" className="fade-up delay-2">
        <button className="bloom-but ">Create a Bloom Post</button>
        </Link>

        <h2 className="fade-up delay-3">Check out the art that's worth the watch:</h2>

        <div className="post-section fade-up delay-4">
          <PostContainer />
        </div>
      </div>

      {/* Optional: Add flower background if needed */}
      <div className="home-background">
        <img src= {flower1} alt="flower" className="flower flower1" />
        <img src= {flower2} alt="flower" className="flower flower2" />
        <img src={flower3} alt="flower" className="flower flower3" />
        <img src= {flower4}alt="flower" className="flower flower4" />
      </div>

      <AboutBloomRoom />

      <Footer />
    </>
  );
};

export default HomeLog;
