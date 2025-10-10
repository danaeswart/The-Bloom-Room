import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./css/BloomPost.css";
import NavbarLog from "../components/NavbarLog";
import { UserContext } from "../context/UserContext";

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

  useEffect(() => {
    
    if (user && user.Role === "artist") {
      console.log("Fetching artist ID for user:", user.User_ID);
      fetch(`http://localhost:5000/artist/${user.User_ID}`)
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

    const formData = new FormData();
    formData.append("Artwork_Name", artworkName);
    formData.append("description", description);
    formData.append("medium", medium);
    formData.append("price", price);
    formData.append("artistID", artistID.toString());

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch("http://localhost:5000/artworks", {
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
        alert(data?.error || "Unknown server error");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload artwork");
    }
  };

  return (
    <>
      <NavbarLog />
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
          <form onSubmit={handlePost}>
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

            <label>
              Price:
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price in USD"
              />
            </label>

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
    </>
  );
}

export default BloomPost;
