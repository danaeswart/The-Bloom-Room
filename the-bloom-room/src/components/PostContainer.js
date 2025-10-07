import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/PostContainer.css";

function PostContainer({ artistId = null }) {
 console.log("PostContainer received artistId:", artistId);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        let endpoint = "http://localhost:5000/artworks";
        console.log("Base endpoint:", endpoint);
       
        if (artistId) {
        endpoint += `/user/${artistId}`;
        console.log("Fetching artworks for artistId:", artistId);
  }


        const res = await axios.get(endpoint);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching artworks:", err);
      }
    };

    fetchArtworks();
  }, [artistId]);
  



  const handleArtworkClick = (artworkId) => {
    navigate(`/artworks/${artworkId}`);
  };

  return (
    <div className="post-container">
      {posts.length > 0 ? (
        posts.map((artwork) => (
          <div
            key={artwork.Artwork_ID}
            className="post-frame"
            onClick={() => handleArtworkClick(artwork.Artwork_ID)}
          >
            <img
              src={`http://localhost:5000${artwork.Image_URL}`}
              alt={artwork.Artwork_Name}
              className="post-image"
            />
            <p className="artwork-name">{artwork.Artwork_Name}</p>
          </div>
        ))
      ) : (
        <p>No artworks found.</p>
        
      )}
    </div>
  );
}

export default PostContainer;
