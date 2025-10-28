import React, { useState, useEffect } from "react";
import {  useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import "./css/Order.css";
import { useNavigate } from "react-router-dom";
// import { BASE_URL } from "../Config";
const BASE_URL= "https://the-bloom-room-5.onrender.com";

const Order = () => {
  const { artworkId } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
    const navigate = useNavigate(); // <-- initialize navigate
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);


  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/artwork/${artworkId}`);
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
      navigate("/login");
      return;
    }
    await axios.post(`${BASE_URL}/orders`, {
      Artwork_ID: artworkId,
      
      Buyer_ID: user.User_ID, // still sends User_ID to backend for lookup
      Message: message,
    });

    // Show success popup
    setShowSuccessPopup(true);
    setMessage("");
    
    // Hide popup and navigate after 2 seconds
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate("/homelog");
    }, 2000);
    
  } catch (err) {
    console.error(err);
    alert("Error sending request.");
  }
};



  if (!artwork) return <p>Loading artwork...</p>;

  // Check if artwork is available for sale (has a valid price AND status is 'available')
  const isForSale = artwork.Price && parseFloat(artwork.Price) > 0 && artwork.Status === 'available';

  return (
    <>
      <Navbar />
      
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-overlay">
          <div className="success-popup">
            <div className="success-icon">✓</div>
            <h3>Request Sent Successfully!</h3>
            <p>The artist will be notified of your request.</p>
          </div>
        </div>
      )}

      <div className="order-page">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Left side - Artwork Images */}
        <div className="order-left">
          {artwork.Images && artwork.Images.length > 0 ? (
            <div className="slider">
              <button className="arrow left" onClick={prevImage}>
                &#10094;
              </button>
              <img
              // maybe issue herer
                src={artwork.Images[currentIndex].Image_URL}
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
          {isForSale ? (
            <p className="price">Price: R{artwork.Price}</p>
          ) : (
            <p className="not-for-sale">This artwork is not for sale</p>
          )}
        </div>

        {/* Right side - Message Box (only show if for sale) */}
        {isForSale ? (
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
        ) : (
          <div className="order-right">
            <div className="not-available-notice">
              <h3>Not Available for Purchase</h3>
              <p>This artwork is currently not for sale. Please check back later or explore other available artworks.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Order;
