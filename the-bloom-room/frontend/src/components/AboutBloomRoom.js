import React, { useEffect, useRef } from "react";
import "./css/AboutBloomRoom.css";
import heroImg from "../assets/images/Tomato.jpeg"; // placeholder hero image
import postArtImg from "../assets/images/Tomato.jpeg"; // placeholder
import inspoImg from "../assets/images/artwork2.jpeg"; // placeholder
import buyerImg from "../assets/images/Tomato.jpeg"; // reverted to original Tomato image
import { Link } from "react-router-dom";
const AboutBloomRoom = () => {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.8;
      sectionRefs.current.forEach((section) => {
        if (section && scrollPos > section.offsetTop) {
          section.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bloomroom-new">

      {/* Hero Section */}
      <section className="hero-section" ref={(el) => (sectionRefs.current[0] = el)}>
        <div className="hero-text">
          <h1>Welcome to Bloom Room</h1>
<p>Bloom Room is a space where you can share anything! Art, ideas, inspiration, or anything that matters to you. Connect with a creative community and celebrate the things that spark your creativity.</p>

        </div>
        <div className="hero-image">
          <img src={inspoImg} alt="Creative Art" />
        </div>
      </section>
{/* Posting Types Section */}
{/* How It Works Section */}
<section
  className="posting-types"
  ref={(el) => (sectionRefs.current[1] = el)}
>
  <h2>How It Works</h2>
  <div className="posting-cards">
    {/* Bulb 1 */}
    <div className="posting-card">
      {/* <img src={postArtImg} alt="Artist Account Icon" className="posting-icon" /> */}
      <h3>Create an Artist Account</h3>
      <p>
        Set up your artist profile and post anything that inspires you — artwork, ideas, or creative projects. 
        You can also choose to put your work up for sale to connect with buyers.
      </p>
      <Link to="/signup">
        <button className="cta-button">Create Artist Account</button>
      </Link>
    </div>

    {/* Bulb 2 */}
    <div className="posting-card">
      {/* <img src={buyerImg} alt="Buyer Account Icon" className="posting-icon" /> */}
      <h3>Create a Buyer Account</h3>
      <p>
        Browse artworks, make requests, and purchase pieces you love directly from artists. 
        Buyers can engage with creators and support their work.
      </p>
      <Link to="/signup">
        <button className="cta-button">Create Buyer Account</button>
      </Link>
    </div>

    {/* Bulb 3 */}
    <div className="posting-card">
      {/* <img src={inspoImg} alt="Sharing Icon" className="posting-icon" /> */}
      <h3>Share & Get Verified</h3>
      <p>
        You can share your creativity by posting 5 artworks or ideas to become a verified member 
        in the Bloom Room community.
      </p>
      <Link to="/signup">
        <button className="cta-button">Start Sharing</button>
      </Link>
    </div>
  </div>
</section>


      {/* Buyer Accounts Section */}
      <section className="buyer-section" ref={(el) => (sectionRefs.current[2] = el)}>
        <div className="buyer-text">
          <h2>Buyer Accounts</h2>
          <p>Only buyers can request or purchase artworks. Sign up as a buyer to explore and support artists.</p>
          <Link to="/signup"><button className="cta-button">Create Buyer Account</button></Link>
        </div>
        <div className="buyer-image">
          <img src={buyerImg} alt="Buyer" />
        </div>
      </section>

      {/* Call To Action */}
      <section className="cta-section" ref={(el) => (sectionRefs.current[3] = el)}>
        <h2>Join the Bloom Room Today!</h2>
        <p>Start posting, sharing, and connecting with artists and creatives worldwide.</p>
        <div className="cta-buttons">
          <a href="/signup"><button className="cta-button">Create Artist Account</button></a>
          <a href="/signup"><button>Create Buyer Account</button></a>
        </div>
      </section>
    </div>
  );
};

export default AboutBloomRoom;
