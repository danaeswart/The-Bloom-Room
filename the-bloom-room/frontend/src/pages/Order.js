import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import "./css/Order.css";

const Order = () => {
  const { artworkId } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const res = await axios.get(`https://the-bloom-room-5.onrender.com/artworks/${artworkId}`);
        setArtwork(res.data);
      } catch (err) {
        console.error("Error fetching artwork:", err);
      }
    };
    fetchArtwork();
  }, [artworkId]);

  const nextImage = () => {
    if (!artwork?.Images) return;
    setCurrentIndex((prev) => (prev + 1) % artwork.Images.length);
  };

  const prevImage = () => {
    if (!artwork?.Images) return;
    setCurrentIndex((prev) =>
      prev === 0 ? artwork.Images.length - 1 : prev - 1
    );
  };

  const handleSubmit = async () => {
  try {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    if (!user) {
      alert("You must be logged in to request artwork.");
      return;
    }
    console.log("Submitting order for artworkId:", artworkId, "with message:", message);
    console.log("User ID:", user.User_ID);
    await axios.post("https://the-bloom-room-5.onrender.com/orders", {
      Artwork_ID: artworkId,
      
      Buyer_ID: user.User_ID, // still sends User_ID to backend for lookup
      Message: message,
    });

    alert("Request sent successfully!");
    setMessage("");
  } catch (err) {
    console.error(err);
    alert("Error sending request.");
  }
};



  if (!artwork) return <p>Loading artwork...</p>;

  return (
    <>
      <Navbar />
      <div className="order-page">
        {/* Left side - Artwork Images */}
        <div className="order-left">
          {artwork.Images && artwork.Images.length > 0 ? (
            <div className="slider">
              <button className="arrow left" onClick={prevImage}>
                &#10094;
              </button>
              <img
                src={`https://the-bloom-room-5.onrender.com${artwork.Images[currentIndex].Image_URL}`}
                alt={`Artwork ${currentIndex + 1}`}
              />
              <button className="arrow right" onClick={nextImage}>
                &#10095;
              </button>
            </div>
          ) : (
            <p>No images found</p>
          )}
          <h2>{artwork.Artwork_Name}</h2>
          <p>by {artwork.Artist_Username}</p>
          <p className="price">Price: R{artwork.Price}</p>
        </div>

        {/* Right side - Message Box */}
        <div className="order-right">
          <h3>Send a message:</h3>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your request here..."
          />
          <button className="request-btn" onClick={handleSubmit}>
            Request Artwork
          </button>
        </div>
      </div>
    </>
  );
};

export default Order;
