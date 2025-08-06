import React, { useState, useRef } from "react";
import "./css/BloomPost.css";
import NavBar from "../components/Navbar";

function BloomPost() {
  const [images, setImages] = useState([]);
  const [artworkName, setArtworkName] = useState("");
  const [description, setDescription] = useState("");
  const [medium, setMedium] = useState("");
  const [price, setPrice] = useState("");
  const fileInputRef = useRef();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files);
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...fileURLs]);
  };

  const handlePost = (e) => {
    e.preventDefault();
    // Here you can handle form submission logic
    alert("Post submitted!");
  };

  return (
    <>
    <NavBar />
    <div className="upload-artwork-page">
      <div className="left-panel">
        <div className="images-container">
          {images.length === 0 && (
            <p className="no-images-text">No images uploaded yet.</p>
          )}
          <div className="images-scroll">
            {images.map((src, i) => (
              <img key={i} src={src} alt={`uploaded ${i}`} />
            ))}
          </div>
        </div>
        <button className="upload-btn" onClick={handleUploadClick}>
          Upload Images
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFilesSelected}
        />
      </div>

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
      </div>
    </div>
    </>
  );
}

export default BloomPost;