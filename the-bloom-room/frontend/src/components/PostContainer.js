import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/PostContainer.css";
import { BASE_URL } from "../Config";

function PostContainer() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        console.log("Fetching artworks from backend...");
        const endpoint = `${BASE_URL}/artwork`;

        const res = await axios.get(endpoint);
        console.log("Response data from backend:", res.data);

        setPosts(res.data);
        console.log("Posts state after setPosts:", res.data);
      } catch (err) {
        console.error("Error fetching artworks:", err);
      }
    };

    fetchArtworks();
  }, []); // runs once on mount

  const handleArtworkClick = (artworkId) => {
    console.log("Artwork clicked with ID:", artworkId);
    navigate(`/artworks/${artworkId}`);
  };

  return (
    <div className="post-container">
      {posts.length > 0 ? (
        posts.map((artwork, index) => {
          console.log(`Rendering artwork #${index}:`, artwork);
          console.log("Image URL for this artwork:", artwork.Image_URL);
          return (
            <div
              key={artwork.Artwork_ID}
              className="post-frame"
              onClick={() => handleArtworkClick(artwork.Artwork_ID)}
            >
              <img
                src={`${BASE_URL}${artwork.Image_URL}`}
                alt={artwork.Artwork_Name || "Artwork"}
                className="post-image"
              />
              <p className="artwork-name">{artwork.Artwork_Name || "Untitled"}</p>
            </div>
          );
        })
      ) : (
        <p>No artworks found.</p>
      )}
    </div>
  );
}

export default PostContainer;
