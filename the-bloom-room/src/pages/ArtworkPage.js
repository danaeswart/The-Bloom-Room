
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./css/ArtworkPage.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";


const ArtworkPage = () => {
  const { artworkId } = useParams(); // from /artwork/:id
  const [artwork, setArtwork] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/artworks/${artworkId}`);
        setArtwork(res.data);
        console.log("Fetched artwork:", res.data);
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
                  src={`http://localhost:5000${artwork.Images[currentIndex].Image_URL}`}
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
          <h2 className="art-title">{artwork.Artwork_Name}</h2>
          <p className="artist-name">
  by <Link to={`/profile/${artwork.Artist_ID}`}>{artwork.Artist_Username}</Link>
</p>


          <h4>Description:</h4>
          <div className="description-box">{artwork.Description}</div>

          <h4>Medium:</h4>
          <p className="medium">{artwork.Medium}</p>

          <h4>Price:</h4>
          <p className="medium">R{artwork.Price}</p>

          <Link to={`/order/${artwork.Artwork_ID}`}>
  <button className="request-btn">Send Request</button>
</Link>

        </div>
      </div>
    </>
  );
};

export default ArtworkPage;
