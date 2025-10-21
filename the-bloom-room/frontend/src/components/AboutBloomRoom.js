import React, { useEffect, useRef } from "react";
import "./css/AboutBloomRoom.css";
import heroImg from "../assets/images/Tomato.jpeg"; // placeholder hero image
import postArtImg from "../assets/images/Tomato.jpeg"; // placeholder
import inspoImg from "../assets/images/Tomato.jpeg"; // placeholder
import buyerImg from "../assets/images/Tomato.jpeg"; // placeholder
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
          <h1>Welcome to Bloom Room </h1>
          <p>Bloom Room is a space for everyone to share art, inspiration, and ideas. Connect with a creative community, discover what sparks creativity, and celebrate the things that inspire you.</p>
        </div>
        <div className="hero-image">
          <img src={heroImg} alt="Creative Art" />
        </div>
      </section>
{/* Posting Types Section */}
<section
  className="posting-types"
  ref={(el) => (sectionRefs.current[1] = el)}
>
  <h2>How It Works</h2>
  <div className="posting-cards">
    <div className="posting-card">
      <h3>Create an Artist Account</h3>
      <p>
        Share your artwork and inspirations with the community. Upload images
        and showcase your creativity to inspire others.
      </p>
    </div>
    <div className="posting-card">
      <h3>Create a Buyer Account</h3>
      <p>
        Browse artworks, make requests, or purchase pieces you love directly
        from creators. Connect with artists and support their work.
      </p>
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
