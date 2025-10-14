import React, { useState } from "react";
import "./css/FlowerCarousel.css";

const FlowerCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="flower-carousel-wrapper">
      <div className="carousel-square">
        <img
          src={images[currentIndex]}
          alt="carousel"
          className="carousel-image"
        />
        <button className="carousel-btn prev-btn" onClick={prevImage}>
          &#8249;
        </button>
        <button className="carousel-btn next-btn" onClick={nextImage}>
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default FlowerCarousel;
