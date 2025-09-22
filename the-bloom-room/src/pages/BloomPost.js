import React, { useState, useRef } from "react";
import "./css/BloomPost.css";
import NavBar from "../components/Navbar";
import FlowerCarousel from "../components/FlowerCarousel";

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

const handlePost = async (e) => {
  e.preventDefault();

  try {
    // 1️⃣ Check if images exist
    if (!images.length) {
      alert("Upload at least one image!");
      return;
    }

    console.log("Images array:", images);
    console.log("Artwork Name:", artworkName);
    console.log("Description:", description);
    console.log("Medium:", medium);
    console.log("Price:", price);

    // 2️⃣ Create FormData
    const formData = new FormData();
    formData.append("artworkName", artworkName);
    formData.append("description", description);
    formData.append("medium", medium);
    formData.append("price", price);

    images.forEach((img, i) => {
      console.log(`Appending image ${i}:`, img);
      formData.append("images", img); // Must be File objects
    });

    // 3️⃣ Send request
    const res = await fetch("http://localhost:5000/artworks", {
      method: "POST",
      body: formData,
    });

    console.log("Response status:", res.status);

    // 4️⃣ Try to parse JSON
    const data = await res.json().catch(err => {
      console.error("Failed to parse JSON:", err);
      return null;
    });

    console.log("Response data:", data);

    if (res.ok) {
      alert("Artwork uploaded!");
      setImages([]);
      setArtworkName("");
      setDescription("");
      setMedium("");
      setPrice("");
    } else {
      alert(data?.error || "Unknown server error");
    }
  } catch (err) {
    console.error("Frontend error in handlePost:", err);
    alert("Failed to upload artwork");
  }
};


  return (
    <>
    <NavBar />
    <div className="upload-artwork-page">
      <div className="left-panel">

      <div className="images-container">
  {images.length === 0 ? (
    <p className="no-images-text">No images uploaded yet.</p>
  ) : (
    <FlowerCarousel images={images} />
  )}
</div>
        {/* <div className="images-container">
          {images.length === 0 && (
            <p className="no-images-text">No images uploaded yet.</p>
          )}
          <div className="images-scroll">
            {images.map((src, i) => (
              <img key={i} src={src} alt={`uploaded ${i}`} />
            ))}
          </div>
        </div> */}
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