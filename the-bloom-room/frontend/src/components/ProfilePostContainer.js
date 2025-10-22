import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/ProfilePostContainer.css";
import { BASE_URL } from "../Config";

function ProfilePostContainer({ artistId = null }) {
  console.log("ProfilePostContainer artistId:", artistId);
  const [posts, setPosts] = useState([]);
  const [orderCounts, setOrderCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworksAndCounts = async () => {
      if (!artistId) return;

      try {
        const artworksRes = await axios.get(`${BASE_URL}/artwork/user/${artistId}`);
        const artworks = artworksRes.data;
        console.log("Fetched artworks for artist:", artworks);

        const countsRes = await axios.get(`${BASE_URL}/orders/artist/${artistId}/counts`);
        const countsData = countsRes.data;
        console.log("Fetched order counts for artist:", countsData);

        const countsMap = {};
        countsData.forEach((item) => {
          countsMap[item.Artwork_ID] = item.RequestCount;
        });

        setPosts(artworks);
        setOrderCounts(countsMap);
      } catch (err) {
        console.error("Error fetching artworks or order counts:", err);
      }
    };

    fetchArtworksAndCounts();
  }, [artistId]);

  const handleArtworkClick = (artworkId) => {
    navigate(`/artistartworks/${artworkId}`);
  };

  if (posts.length === 0) {
    return (
      <div className="post-container">
        <p>No artworks found.</p>
      </div>
    );
  }

  return (
    <div className="post-container">
      {posts.map((artwork) => {
        const requestCount = orderCounts[artwork.Artwork_ID] || 0;

        return (
          <div key={artwork.Artwork_ID} className="post-wrapper">
            {requestCount > 0 && (
              <div className="request-badge">{requestCount}</div>
            )}

            <div
              className="post-frame"
              onClick={() => handleArtworkClick(artwork.Artwork_ID)}
            >
              <img
                src={`${artwork.Image_URL}`}
                alt={artwork.Artwork_Name}
                className="post-image"
              />
              <p className="artwork-name">{artwork.Artwork_Name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProfilePostContainer;
