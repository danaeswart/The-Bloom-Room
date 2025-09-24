import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/BloomPost.css";
import NavbarLog from "../components/NavbarLog";
import FlowerCarousel from "../components/FlowerCarousel";

function BloomPost() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [images, setImages] = useState([]); // store File objects
  const [artworkName, setArtworkName] = useState(""); // fixed undefined error
  const [description, setDescription] = useState("");
  const [medium, setMedium] = useState("");
  const [price, setPrice] = useState("");
  const [artistID, setArtistID] = useState(null); // to store artist id from backend

  const fileInputRef = useRef();

    useEffect(() => {
  if (user && user.Role === "artist") {
    console.log("Logged in user:", user);

    fetch(`http://localhost:5000/artist/${user.User_ID}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Artist data fetched:", data);
        setArtistID(data.Artist_ID); // <-- Important!
      })
      .catch((err) => console.error(err));
  }
}, [user]);


  // Trigger file input
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Keep File objects for upload
  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };
const handlePost = async (e) => {
  e.preventDefault();

  if (!artistID) {
    console.error("Artist ID not loaded yet");
    return;
  }

  if (!artworkName || !description) {
    alert("Please fill in all required fields.");
    return;
  }

  const formData = new FormData();
  formData.append("Artwork_Name", artworkName); // <-- match DB column name
  formData.append("description", description);
  formData.append("medium", medium);
  formData.append("price", price);
  formData.append("artistID", artistID.toString()); // <-- important

  images.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const res = await fetch("http://localhost:5000/artworks", {
      method: "POST",
      body: formData,
    });

   let data = {};
try {
  data = await res.json();
} catch (error) {
  console.error("Error parsing JSON:", error);
}
console.log("Artwork post response:", data);
  
    console.log("Artwork post response:", data);

    if (res.ok) {
      alert("Artwork uploaded successfully!");
      // Reset fields
      setImages([]);
      setArtworkName("");
      setDescription("");
      setMedium("");
      setPrice("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Redirect or reload
      navigate("/homelog", { state: { user: user } }); // or navigate to a specific page with new post
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
