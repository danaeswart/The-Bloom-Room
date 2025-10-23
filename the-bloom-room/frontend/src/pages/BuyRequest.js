import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./css/ArtworkPage.css";
import axios from "axios";
// import { BASE_URL } from "../Config";

const BASE_URL= "https://the-bloom-room-5.onrender.com";

const BuyRequests = () => {
  const { artworkId } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [orderId, setOrderId] = useState(null);
  const [buyerId, setBuyerId] = useState(null);
  const [isSoldToBuyer, setIsSoldToBuyer] = useState(false);

  const navigate = useNavigate();

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // Get buyer ID from localStorage
  useEffect(() => {
    const storedBuyerId = localStorage.getItem("buyerId");
    if (storedBuyerId) setBuyerId(parseInt(storedBuyerId));
  }, []);

  useEffect(() => {
    const fetchArtworkAndOrder = async () => {
      if (!buyerId || !artworkId) return;

      try {
        const artworkRes = await axios.get(`${BASE_URL}/artwork/${artworkId}`);
        const fetchedArtwork = artworkRes.data;
        setArtwork(fetchedArtwork);

        const ordersRes = await axios.get(`${BASE_URL}/orders/buyer/${buyerId}`);
        const order = ordersRes.data.find((o) => o.Artwork_ID === parseInt(artworkId));

        if (order) {
          setOrderId(order.Order_ID);
          // Check if the artwork is sold and if this buyer is the one who bought it
          if (fetchedArtwork.Status === "Sold" && order.Buyer_ID === buyerId) {
            setIsSoldToBuyer(true);
          }
        }
      } catch (err) {
        console.error("Error fetching artwork or order:", err);
      }
    };

    fetchArtworkAndOrder();
  }, [buyerId, artworkId]);

  const nextImage = () => {
    if (!artwork?.Images?.length) return;
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % artwork.Images.length);
  };

  const prevImage = () => {
    if (!artwork?.Images?.length) return;
    setDirection("left");
    setCurrentIndex((prev) =>
      prev === 0 ? artwork.Images.length - 1 : prev - 1
    );
  };

  const handleDeleteRequest = async () => {
    if (!orderId) return;
    try {
      await axios.delete(`${BASE_URL}/orders/${orderId}`);
      alert("Request deleted successfully");
      navigate("/profilebuy");
    } catch (err) {
      console.error("Error deleting request:", err);
      alert("Failed to delete request.");
    }
  };

  if (!artwork) return <p style={{ marginTop: "5rem" }}>Loading artwork...</p>;

  return (
    <>
      <Navbar />
      <div className="artwork-page" style={{ marginTop: "5rem" }}>
        {/* Carousel */}
        <div className="carousel">
          {artwork.Images?.length > 0 && (
            <>
              <button className="arrow left" onClick={prevImage}>
                &#10094;
              </button>
              <div className={`image-container ${direction}`}>
                <img
                  key={currentIndex}
                  src={artwork.Images[currentIndex].Image_URL}
                  alt={`Artwork ${currentIndex + 1}`}
                />
              </div>
              <button className="arrow right" onClick={nextImage}>
                &#10095;
              </button>
            </>
          )}
        </div>

        {/* Artwork Info */}
        <div className="artwork-info">
          <div className="art-title-status">
            <h2 className="art-title">{artwork.Artwork_Name}</h2>
            <span className={`art-status ${artwork.Status}`}>
              {isSoldToBuyer
                ? "Sold to You!"
                : artwork.Status}
            </span>
          </div>

          <p className="artist-name">
            by {artwork.Artist_Username || "Unknown Artist"}
          </p>

          <h4>Description:</h4>
          <div className="description-box">{artwork.Description}</div>

          <h4>Medium:</h4>
          <p className="medium">{artwork.Medium}</p>

          <h4>Price:</h4>
          <p className="medium">R{artwork.Price}</p>

          {/* Sold message */}
          {isSoldToBuyer ? (
            <div className="sold-message">
              <p>
                🎉 Congratulations! This artwork has been sold to you. <br />
                We’ve sent your contact information to{" "}
                <strong>{artwork.Artist_Username}</strong> so they can get in
                touch with you soon.
              </p>
            </div>
          ) : (
            <button className="request-btn" onClick={handleDeleteRequest}>
              Delete Request
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default BuyRequests;
