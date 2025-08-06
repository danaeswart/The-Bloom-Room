import React from "react";
import "./css/About.css"; // Ensure you create this CSS file for styling
import teamImg from "../assets/images/artwork1.jpeg"; // Add an image in /src/assets
import missionImg from "../assets/images/artwork2.jpeg";
import visionImg from "../assets/images/artwork3.jpeg";
import Navbar from "../components/Navbar"; // Import the Navbar component
const About = () => {
  return (
    <>
    <Navbar /> {/* Render the Navbar component */}
   
    <div className="about-container">
      <section className="about-hero">
        <h1>About ArtConnect</h1>
        <p>Connecting artists and art lovers in one inspiring space.</p>
      </section>

      <section className="about-section">
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
        <img src={teamImg} alt="Our Team" className="about-image" />
      </section>

      <section className="about-section reverse">
        <img src={missionImg} alt="Mission" className="about-image" />
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
        <div className="about-text">
          <h2>Our Vision</h2>
          <p>
            Our vision is to become the leading global hub for creative
            expression — an inclusive, accessible, and inspiring platform that
            nurtures talent and helps artists transform passion into profession.
          </p>
        </div>
        <img src={visionImg} alt="Vision" className="about-image" />
      </section>
    </div>
     </>
  );
};

export default About;
