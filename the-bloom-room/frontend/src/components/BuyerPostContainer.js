import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/ProfilePostContainer.css";

function BuyerPostContainer({ buyerId }) {
   
  const [requestedArtworks, setRequestedArtworks] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
  const fetchBuyerRequests = async () => {
    if (!buyerId) return;

    try {
      console.log("Fetching orders for buyerId:", buyerId);
      const ordersRes = await axios.get(`http://localhost:5000/orders/buyer/${buyerId}`);
      const orders = ordersRes.data;
      console.log("Buyer orders:", orders);

      // Save buyerId in local storage for BuyRequests page
      localStorage.setItem("buyerId", buyerId);

      const artworkIds = orders.map((order) => order.Artwork_ID);
      if (artworkIds.length === 0) {
        setRequestedArtworks([]);
        return;
      }

      const artworksRes = await axios.post(`http://localhost:5000/artworks/bulk`, { artworkIds });
      const artworks = artworksRes.data;

      const merged = artworks.map((art) => {
        const order = orders.find((o) => o.Artwork_ID === art.Artwork_ID);
        return { ...art, orderStatus: order.Status, requestedAt: order.RequestedAt, orderMessage: order.Message };
      });

      setRequestedArtworks(merged);
    } catch (err) {
      console.error("Error fetching buyer requested artworks:", err);
    }
  };

  fetchBuyerRequests();
}, [buyerId]);


  const handleArtworkClick = (artworkId) => {
    console.log("clicked with artwork id", artworkId);
    navigate(`/buyrequests/${artworkId}`); // Navigate to buy request details page
  };

  if (requestedArtworks.length === 0) {
    return (
      <div className="post-container">
        <p>No requested artworks yet.</p>
      </div>
    );
  }

  return (
    <div className="post-container">
      {requestedArtworks.map((art) => (
        <div key={art.Artwork_ID} className="post-wrapper">
          <div
            className="post-frame"
            onClick={() => handleArtworkClick(art.Artwork_ID)}
          >
            <img
              src={`http://localhost:5000${art.Images[0]?.Image_URL || "/uploads/default.png"}`}
              alt={art.Artwork_Name}
              className="post-image"
            />
            <p className="artwork-name">{art.Artwork_Name}</p>
            <p className="artist-name">@{art.Artist_Username}</p>
            <p className="order-status">Status: {art.orderStatus}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BuyerPostContainer;
