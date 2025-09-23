import React, { useState, useRef } from "react";
import "./css/BloomPost.css";
import NavBar from "../components/Navbar";

function BloomPost() {
  const [images, setImages] = useState([]); // store File objects
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [medium, setMedium] = useState("");
  const [price, setPrice] = useState("");
  const fileInputRef = useRef();

  // Trigger file input
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Keep File objects for upload
  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  // =========================
  // Submit Artwork + Images
  // =========================
  const handlePost = async (e) => {
    e.preventDefault();

    if (!images.length) {
      alert("Upload at least one image!");
      return;
    }

   const userId = localStorage.getItem("userId");
   console.log("userId:", userId);
formData.append("userId", userId); // / logged-in user's ID
    if (!userId) {
      alert("You must be logged in as an artist to post!");
      return;
    }

    const formData = new FormData();
    formData.append("artistId", userId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("medium", medium);
    formData.append("price", price);

    // add multiple images
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
        alert("Artwork uploaded!");
        // reset fields
        setImages([]);
        setTitle("");
        setDescription("");
        setMedium("");
        setPrice("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        alert(data?.message || "Unknown server error");
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
              <div className="images-scroll">
                {images.map((file, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(file)}
                    alt={`uploaded ${i}`}
                  />
                ))}
              </div>
            )}
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
