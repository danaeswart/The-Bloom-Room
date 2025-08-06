import React from "react";
import flowerBlue from "../assets/images/flower-blue.png";
import flowerGreen from "../assets/images/flower-green.png";
import flowerPink from "../assets/images/flower-pink.png";
import flowerRed from "../assets/images/flower-red.png";
import "./css/FlowerBackground.css"; // Assuming you have a CSS file for styling

function FlowerBackground() {
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
