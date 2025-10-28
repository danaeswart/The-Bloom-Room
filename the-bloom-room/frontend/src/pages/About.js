import React, { useEffect, useState } from "react";
import "./css/About.css";
import teamImg from "../assets/images/artwork1.jpeg";
import missionImg from "../assets/images/artwork2.jpeg";
import visionImg from "../assets/images/artwork3.jpeg";
import flowerBlue from "../assets/images/flower-blue.png";
import flowerPink from "../assets/images/flower-pink.png";
import flowerGreen from "../assets/images/flower-green.png";
import flowerLightGreen from "../assets/images/flower-lightgreen.png";
import flowerRed from "../assets/images/flower-red.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar />

      <div className={`about-container ${fadeIn ? "visible" : ""}`}>
        <section className="about-hero">
          <h1>About ArtConnect</h1>
          <p>Connecting artists and art lovers in one inspiring space.</p>
        </section>

        <section className="about-section">
          <img src={teamImg} alt="Our Team" className="about-image main-img" />
          <div className="about-text">
            <h2>Who We Are</h2>
            <p>
              ArtConnect is a platform built by artists, for artists. Our mission
              is to create a space where creativity thrives, collaboration is
              easy, and art is celebrated. We empower both emerging and
              established artists to showcase their work, connect with potential
              clients, and grow their careers.
            </p>
          </div>
        </section>

        <section className="about-section reverse">
          <img src={missionImg} alt="Mission" className="about-image main-img" />
          <div className="about-text">
            <h2>Our Mission</h2>
            <p>
              We exist to break down barriers in the art world. ArtConnect makes
              it simple to display artwork, get commissioned, and build lasting
              relationships between artists and clients in a professional, secure,
              and user-friendly way.
            </p>
          </div>
        </section>

        <section className="about-section">
          <img src={visionImg} alt="Vision" className="about-image main-img" />
          <div className="about-text">
            <h2>Our Vision</h2>
            <p>
              Our vision is to become the leading global hub for creative
              expression — an inclusive, accessible, and inspiring platform that
              nurtures talent and helps artists transform passion into profession.
            </p>
          </div>
        </section>

        <section className="about-section reverse">
          <img src={teamImg} alt="Built by Student" className="about-image main-img" />
          <div className="about-text">
            <h2>Why This Solution Was Built</h2>
            <p>
              ArtConnect was built to give artists a dedicated space where their
              work is seen, valued, and connected with the right audience. It was
              created by a university student at Open Window to address the gap
              between talent and opportunity in the modern art world. Every
              feature was designed to be simple, intuitive, and focused on fostering
              creativity and collaboration.
            </p>
          </div>
        </section>

        <img src={flowerBlue} alt="Blue Flower" className="about-flower flower-blue" />
        <img src={flowerPink} alt="Pink Flower" className="about-flower flower-pink" />
        <img src={flowerGreen} alt="Green Flower" className="about-flower flower-green" />
        <img src={flowerLightGreen} alt="Light Green Flower" className="about-flower flower-lightgreen" />
        <img src={flowerRed} alt="Red Flower" className="about-flower flower-red" />
      </div>
      <Footer />
    </>
  );
};

export default About;
