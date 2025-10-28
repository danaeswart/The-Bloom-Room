import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./css/BloomPost.css";
import NavbarLog from "../components/NavbarLog";
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import flowerSpinner from "../assets/images/flower-pink.png";
// import { BASE_URL } from "../Config";

const BASE_URL= "https://the-bloom-room-5.onrender.com";

function BloomPost() {

 

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");

  const [artworkName, setArtworkName] = useState("");
  const [description, setDescription] = useState("");
  const [medium, setMedium] = useState("");
  const [price, setPrice] = useState("");
  const [artistID, setArtistID] = useState(null);
const fileInputRef = useRef();

const [artworkStatus, setArtworkStatus] = useState("available"); // default
  const [isUploading, setIsUploading] = useState(false); // loading state

  useEffect(() => {
    
    if (user && user.Role === "artist") {
      console.log("Fetching artist ID for user:", user.User_ID);
      
      fetch(`${BASE_URL}/artist/user/${user.User_ID}`)
        .then((res) => res.json())
        .then((data) => {
          setArtistID(data.Artist_ID);
          console.log("Artist ID set to;:", data.Artist_ID);
        });
        
    }
  }, [user]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const nextImage = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection("left");
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handlePost = async (e) => {
    e.preventDefault();

    if (!artistID) console.error("Artist ID not set");
    if (!artistID) return;

    if (!artworkName || !description) {
      alert("Please fill in all required fields.");
      return;
    }
     if (!artworkStatus) {
    alert("Please choose whether this is for sale or just a post.");
    return;
  }

    // If posting for sale, ensure a valid price is provided
    if (artworkStatus === "available") {
      const p = parseFloat(price);
      if (isNaN(p) || p < 0) {
        alert("Please enter a valid non-negative price for items marked for sale.");
        return;
      }
    }

    // Show loading overlay
    setIsUploading(true);

    const formData = new FormData();
    formData.append("Artwork_Name", artworkName);
    formData.append("description", description);
    formData.append("medium", medium);
    formData.append("artistID", artistID.toString());
    formData.append("status", artworkStatus); // <-- send current selection

    // Only include price when item is for sale
    if (artworkStatus === "available") {
      formData.append("price", price);
    }

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch(`${BASE_URL}/artwork`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setImages([]);
        setArtworkName("");
        setDescription("");
        setMedium("");
        setPrice("");
        
        if (fileInputRef.current) fileInputRef.current.value = "";
        navigate("/homelog");
      } else {
        setIsUploading(false); // Hide loading on error
        alert(data?.error || "Unknown server error");
      }
    } catch (err) {
      console.error(err);
      setIsUploading(false); // Hide loading on error
      alert("Failed to upload artwork");
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Loading Overlay */}
      {isUploading && (
        <div className="upload-overlay">
          <div className="upload-spinner">
            <img src={flowerSpinner} alt="Loading" className="flower-spinner" />
            <p>Uploading Post...</p>
          </div>
        </div>
      )}

      <div className="upload-artwork-page">
        {/* Left - Carousel */}
        <div className="left-panel">
        <div className="carousel">
          {images.length > 0 ? (
            <>
              <button className="arrow left" onClick={prevImage}>
                &#10094;
              </button>

              <div className={`image-container ${direction}`}>
                <img
                  key={currentIndex}
                  src={URL.createObjectURL(images[currentIndex])}
                  alt={`Artwork ${currentIndex + 1}`}
                />
              </div>

              <button className="arrow right" onClick={nextImage}>
                &#10095;
              </button>
            </>
          ) : (
            <p className="no-images-text">No images uploaded yet.</p>
          )}
          
        </div>

             <button className="upload-btn" onClick={handleUploadClick}>
            Upload Images
          </button>
            </div>


        {/* Right - Form */}
        <div className="right-panel">
          <h2>Create Bloom Post</h2>
          <form onSubmit={handlePost} className="form-bloom-post">

           <div className="status-buttons">
  <button
    type="button"
    className={artworkStatus === "available" ? "selected" : ""}
    onClick={() => setArtworkStatus("available")}
  >
    Upload for Sale
  </button>

  <button
    type="button"
    className={artworkStatus === "not_available" ? "selected" : ""}
    onClick={() => setArtworkStatus("not_available")}
  >
    Just Post
  </button>
</div>


            <label>
              Artwork Name:
              <input
                type="text"
                value={artworkName}
                onChange={(e) => setArtworkName(e.target.value)}
                required
                placeholder="Enter artwork name"
              />
            </label>

            <label>
              Description of Artwork:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe your artwork..."
              />
            </label>

            <label>
              Medium:
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="E.g., Oil on canvas"
              />
            </label>

            {artworkStatus === "available" && (
              <label>
                Price:
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price in USD"
                  required={artworkStatus === "available"}
                />
              </label>
            )}

            <button type="submit" className="post-btn">
              Post
            </button>
          </form>

         
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFilesSelected}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BloomPost;
