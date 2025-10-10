import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import "./css/ArtworkPage.css";

const ArtistArtwork = () => {
  const { artworkId } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedArtwork, setUpdatedArtwork] = useState({});
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchArtwork();
    fetchRequests();
  }, [artworkId]);

  const fetchArtwork = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/artworks/${artworkId}`);
      setArtwork(res.data);
      setUpdatedArtwork(res.data);
    } catch (err) {
      console.error("Error fetching artwork:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/orders/artwork/${artworkId}`);
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleChange = (e) => {
    setUpdatedArtwork({ ...updatedArtwork, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/artworks/${artworkId}`, updatedArtwork);
      setArtwork(updatedArtwork);
      setEditMode(false);
      alert("Artwork updated successfully!");
    } catch (err) {
      console.error("Error updating artwork:", err);
      alert("Failed to update artwork.");
    }
  };

  const handleStatusChange = async (commissionId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/commissions/${commissionId}`, { Status: newStatus });
      fetchRequests(); // refresh list
    } catch (err) {
      console.error("Error updating commission:", err);
    }
  };

  if (!artwork) return <p>Loading artwork...</p>;

  return (
    <>
      <Navbar />
      <div className="artwork-page">
        {/* Left - Artwork Image */}
        <div className="carousel">
          {artwork.Images?.length > 0 && (
            <img
              src={`http://localhost:5000${artwork.Images[0].Image_URL}`}
              alt="Artwork"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>

        {/* Right - Artwork Info */}
        <div className="artwork-info">
          {editMode ? (
            <>
              <input
                type="text"
                name="Artwork_Name"
                value={updatedArtwork.Artwork_Name}
                onChange={handleChange}
                className="edit-input"
              />

              <textarea
                name="Description"
                value={updatedArtwork.Description}
                onChange={handleChange}
                className="edit-textarea"
              />

              <input
                type="text"
                name="Medium"
                value={updatedArtwork.Medium}
                onChange={handleChange}
                className="edit-input"
              />

              <input
                type="number"
                name="Price"
                value={updatedArtwork.Price}
                onChange={handleChange}
                className="edit-input"
              />

              <button className="request-btn" onClick={handleSave}>
                💾 Save Changes
              </button>
            </>
          ) : (
            <>
              <h2 className="art-title">{artwork.Artwork_Name}</h2>
              <h4>Description:</h4>
              <div className="description-box">{artwork.Description}</div>

              <h4>Medium:</h4>
              <p className="medium">{artwork.Medium}</p>

              <h4>Price:</h4>
              <p className="medium">R{artwork.Price}</p>

              <button className="request-btn" onClick={() => setEditMode(true)}>
                ✏️ Edit Artwork
              </button>
            </>
          )}
        </div>
      </div>

      {/* ----- Requests Section ----- */}
      <div className="requests-section">
        <h3>Requests for this artwork</h3>

        {requests.length === 0 ? (
          <p>No requests yet.</p>
        ) : (
          requests.map((req) => (
            <div className="request-card" key={req.Commission_ID}>
              <div className="request-info">
                <p>
                  <strong>Buyer:</strong> {req.Buyer_Username || req.Buyer_Name || "Unknown"}
                </p>
                <p>
                  <strong>Message:</strong> {req.Message || "No message provided."}
                </p>
                <p>
                  <strong>Status:</strong> {req.Status}
                </p>
              </div>

              {req.Status === "Pending" && (
                <div className="request-actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleStatusChange(req.Commission_ID, "Approved")}
                  >
                    Approve ✅
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => handleStatusChange(req.Commission_ID, "Declined")}
                  >
                    Decline ❌
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ArtistArtwork;
