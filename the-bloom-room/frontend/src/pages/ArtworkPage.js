import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./css/ArtworkPage.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import { BASE_URL } from "../Config";

const ArtworkPage = () => {
  const { artworkId } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [hasRequested, setHasRequested] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/artworks/${artworkId}`);
        setArtwork(res.data);

        // Check if user already requested this artwork
        const user = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user"))
          : null;
          console.log("Current user:::", user);

        if (user) {
          const requestsRes = await axios.get(
            `${BASE_URL}/orders/user/${user.User_ID}`
          );

          const requested = requestsRes.data.some(
            (order) => order.Artwork_ID === parseInt(artworkId)
          );
          setHasRequested(requested);
        }

      } catch (err) {
        console.error("Error fetching artwork:", err);
      }
    };

    fetchArtwork();
  }, [artworkId]);

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

  if (!artwork) return <p>Loading artwork...</p>;

  return (
    <>
      <Navbar />
      <div className="artwork-page">
        {/* Left - Carousel */}
        <div className="carousel">
          {artwork.Images?.length > 0 && (
            <>
              <button className="arrow left" onClick={prevImage}>
                &#10094;
              </button>

              <div className={`image-container ${direction}`}>
                <img
                  key={currentIndex}
                  src={`${BASE_URL}${artwork.Images[currentIndex].Image_URL}`}
                  alt={`Artwork ${currentIndex + 1}`}
                />
              </div>

              <button className="arrow right" onClick={nextImage}>
                &#10095;
              </button>
            </>
          )}
        </div>

        {/* Right - Artwork Info */}


        <div className="artwork-info">
  <div className="art-title-status">
    <h2 className="art-title">{artwork.Artwork_Name}</h2>
    <span className={`art-status ${artwork.Status.toLowerCase()}`}>
      {artwork.Status}
    </span>
  </div>
  <p className="artist-name">
    by <Link to={`/profile/${artwork.Artist_ID}`}>{artwork.Artist_Username}</Link>
  </p>

  <h4>Description:</h4>
  <div className="description-box">{artwork.Description}</div>

  <h4>Medium:</h4>
  <p className="medium">{artwork.Medium}</p>

  <h4>Price:</h4>
  <p className="medium">R{artwork.Price}</p>

{/* --- Button Logic --- */}
{(() => {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  if (!user) {
    // Not logged in → hide button
    return null;
  } else if (user.User_ID === artwork.Artist_User_ID) {
    // Artist viewing their own artwork → hide button
    return null;
  } else if (artwork.Status.toLowerCase() === "sold") {
    // Artwork is sold → hide button
    return null;
  } else if (hasRequested) {
    // Buyer already requested → go to profilebuy
    return (
      <button
        className="request-btn"
        onClick={() => navigate(`/profilebuy`)}
      >
        Already Requested
      </button>
    );
  } else {
    // Buyer has not requested
    return (
      <Link to={`/order/${artwork.Artwork_ID}`}>
        <button className="request-btn">Send Request</button>
      </Link>
    );
  }
})()}

</div>

      </div>
    </>
  );
};

export default ArtworkPage;
