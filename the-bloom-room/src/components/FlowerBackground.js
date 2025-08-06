import React, { useEffect } from "react";
import flowerBlue from "../assets/images/flower-blue.png";
import flowerGreen from "../assets/images/flower-green.png";
import flowerPink from "../assets/images/flower-pink.png";
import flowerRed from "../assets/images/flower-red.png";
import "./css/FlowerBackground.css";

function FlowerBackground() {
  useEffect(() => {
    const handleScroll = () => {
      const flowers = document.querySelectorAll(".flower");
      flowers.forEach((flower) => {
        if (window.scrollY > 50) {
          flower.classList.add("spin-up");
        } else {
          flower.classList.remove("spin-up");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flower-background-component">
      <img src={flowerBlue} alt="Flower 1" className="flower flower-top-left" />
      <img src={flowerGreen} alt="Flower 2" className="flower flower-top-right" />
      <img src={flowerPink} alt="Flower 3" className="flower flower-bottom-left" />
      <img src={flowerRed} alt="Flower 4" className="flower flower-bottom-right" />
    </div>
  );
}

export default FlowerBackground;
