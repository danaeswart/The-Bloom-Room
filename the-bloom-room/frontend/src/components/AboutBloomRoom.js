import React, { useEffect, useRef } from "react";
import "./css/AboutBloomRoom.css";

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

  const features = [
    {
      title: "Feed",
      description: "Browse posts from the community, get inspired, and discover new ideas.",
      link: "/feed",
    },
    {
      title: "BloomPost",
      description: "Share your creations, thoughts, and projects with the Bloom Room community.",
      link: "/bloompost",
    },
    {
      title: "About",
      description: "Learn about our mission, values, and how we foster creativity and collaboration.",
      link: "/about",
    },
    {
      title: "Resources",
      description: "Access guides, tools, and prompts to help your creativity bloom.",
      link: "/resources",
    },
  ];

  return (
    <div className="bloomroom-clean">
      {/* Hero Section */}
      <section className="hero" ref={(el) => (sectionRefs.current[0] = el)}>
        <h1>Welcome to The Bloom Room 🌿</h1>
        <p>
         The Bloom Room is a creative community where ideas flourish and inspiration never stops. Here, you can explore a variety of projects, artworks, and designs shared by passionate creators from all over. It’s more than just a platform to browse—it’s a space to interact, share, and grow your own creativity. Showcase your own projects, save content that sparks your imagination, and even request custom artworks or creations tailored to your vision.

Whether you’re an artist, designer, writer, or simply someone who loves discovering new ideas, The Bloom Room gives you the tools and space to connect with like-minded minds. Cultivate your ideas, collaborate with others, and watch your creativity bloom in a space designed to inspire, create, and connect.
        </p>
        <a href="/feed">
          <button>Explore Feed</button>
        </a>
      </section>

      {/* Features Section */}
      <section className="features" ref={(el) => (sectionRefs.current[1] = el)}>
        {features.map((feature, i) => (
          <div className="feature-card" key={i}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
            <a href={feature.link}>
              <button>Go to {feature.title}</button>
            </a>
          </div>
        ))}
      </section>

      {/* Statistics Section */}
      <section className="stats" ref={(el) => (sectionRefs.current[2] = el)}>
        <div className="stat">
          <h3>500+</h3>
          <p>Members</p>
        </div>
        <div className="stat">
          <h3>1200+</h3>
          <p>Posts Shared</p>
        </div>
        <div className="stat">
          <h3>50+</h3>
          <p>Resources Created</p>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="cta" ref={(el) => (sectionRefs.current[3] = el)}>
        <h2>Ready to Bloom?</h2>
        <p>Join the Bloom Room today and start sharing, creating, and connecting!</p>
        <div className="cta-buttons">
          {features.map((feature, i) => (
            <a href={feature.link} key={i}>
              <button>{feature.title}</button>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutBloomRoom;
