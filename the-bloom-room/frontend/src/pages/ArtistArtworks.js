import React, { useState, useEffect } from "react";


import Navbar from "../components/Navbar";
import { Helmet } from "react-helmet";
import axios from "axios";
import "./css/ArtworkPage.css";
import { useNavigate, useParams } from "react-router-dom";
// import { BASE_URL } from "../Config";

const BASE_URL= "https://the-bloom-room-5.onrender.com";

const ArtistArtwork = () => {
  const { artworkId } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedArtwork, setUpdatedArtwork] = useState({});
  const [requests, setRequests] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();


  useEffect(() => {
    fetchArtwork();
    fetchRequests();
  }, [artworkId]);

  const fetchArtwork = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/artwork/${artworkId}`);
      setArtwork(res.data);
      setUpdatedArtwork(res.data);
    } catch (err) {
      console.error("Error fetching artwork:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/orders/artwork/${artworkId}`);
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
      await axios.put(`${BASE_URL}/artwork/${artworkId}`, updatedArtwork);
      setArtwork(updatedArtwork);
      setEditMode(false);
      setToastMessage("Artwork updated successfully!");
setShowToast(true);
setTimeout(() => setShowToast(false), 2000);

    } catch (err) {
      console.error("Error updating artwork:", err);
      alert("Failed to update artwork.");
    }
  };

const handleDelete = async () => {
  try {
    await axios.delete(`${BASE_URL}/artwork/${artworkId}`);
    setShowDeleteModal(false);
    navigate(`/profile/${artwork.Artist_ID}`);
  } catch (err) {
    console.error("Error deleting artwork:", err);
    setShowDeleteModal(false);
    // Optionally show error modal or toast here
  }
};



  const handleStatusChange = async (commissionId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/commissions/${commissionId}`, { Status: newStatus });
      fetchRequests(); // refresh list
    } catch (err) {
      console.error("Error updating commission:", err);
    }
  };

const updateStatus = async (orderId, status) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/orders/${orderId}/status`,
      { status }
    );

    // REFRESH requests from the backend
    fetchRequests();
  } catch (err) {
    console.error("❌ Error updating status:", err);
  }
};




  if (!artwork) return <p>Loading artwork...</p>;

  return (
      <>
        <Helmet>
          <title>Artist Artworks | The Bloom Room</title>
          <meta name="description" content="View and manage your artworks as an artist on The Bloom Room." />
          <meta name="keywords" content="artist, artworks, manage, edit, The Bloom Room, gallery" />
          <meta name="author" content="The Bloom Room Team" />
          <meta property="og:title" content="Artist Artworks | The Bloom Room" />
          <meta property="og:description" content="View and manage your artworks as an artist on The Bloom Room." />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/bloomroom-og-image.jpg" />
          <meta property="og:url" content="https://thebloomroom.com/artist-artworks" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Artist Artworks | The Bloom Room" />
          <meta name="twitter:description" content="View and manage your artworks as an artist on The Bloom Room." />
          <meta name="twitter:image" content="/bloomroom-og-image.jpg" />
        </Helmet>
        <Navbar />
      <div className="back-button-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
      </div>
      <div className="artwork-page row-layout">
        {/* Left - Artwork Image */}
        <div className="carousel">
          {artwork.Images?.length > 0 && (
            <img
              src={artwork.Images[0].Image_URL}
              alt="Artwork"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>

        {/* Right - Artwork Info */}
        <div className="artwork-info">
          <h2 className="art-title">{editMode ? (
            <input
              type="text"
              name="Artwork_Name"
              value={updatedArtwork.Artwork_Name}
              onChange={handleChange}
              className="edit-input"
              style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "10px" }}
            />
          ) : artwork.Artwork_Name}</h2>

          <h4>Description:</h4>
          {editMode ? (
            <textarea
              name="Description"
              value={updatedArtwork.Description}
              onChange={handleChange}
              className="edit-textarea"
              style={{ background: "#f5f5f5", padding: "12px", borderRadius: "8px", fontSize: "1.2rem", color: "#444" }}
            />
          ) : (
            <div className="description-box">{artwork.Description}</div>
          )}

          <h4>Medium:</h4>
          {editMode ? (
            <input
              type="text"
              name="Medium"
              value={updatedArtwork.Medium}
              onChange={handleChange}
              className="edit-input"
              style={{ fontSize: "1.2rem", color: "#2C4C34" }}
            />
          ) : (
            <p className="medium">{artwork.Medium}</p>
          )}

          <h4>Price:</h4>
          {editMode ? (
            <input
              type="number"
              name="Price"
              value={updatedArtwork.Price}
              onChange={handleChange}
              className="edit-input"
              style={{ fontSize: "1.2rem", color: "#2C4C34" }}
            />
          ) : (
            <p className="medium">R{artwork.Price}</p>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
            {editMode ? (
              <>
                <button className="request-btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
                  Delete Artwork
                </button>
                <button className="request-btn" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="request-btn" onClick={() => setEditMode(true)}>
                Edit Artwork
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay restrict-bg">
          <div className="modal-content">
            <h3>Delete Artwork</h3>
            <p>Are you sure you want to delete this artwork? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="modal-confirm" onClick={handleDelete}>Yes, Delete</button>
              <button className="modal-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ----- Requests Section ----- */}
      <div className="requests-section">
        <h3>Requests for this artwork</h3>

        {requests.length === 0 ? (
          <p>No requests yet.</p>
        ) : (
          requests.map((req) => (
            <div className="request-card" key={req.Order_ID}>
              <div className="request-info">
                <p>
                  <strong>Buyer: </strong>
                  <span 
                    className="buyer-link"
                    onClick={() => navigate(`/buyer-profile/${req.Buyer_ID}`)}
                  >
                    {req.Buyer_Name} {req.Buyer_Surname} (@{req.Buyer_Username})
                  </span>
                </p>
                <p><strong>Message:</strong> {req.Message || "No message"}</p>
                <p><strong>Status:</strong> {req.Status}</p>
                
                {req.Status === "Sold" && (
                  <div className="buyer-contact-info">
                    <p>
                      Your info has been sent to the buyer.  <strong>{req.Buyer_Email}</strong>
                    </p>
                  </div>
                )}
              </div>

              <div className="request-actions">
                {req.Status !== "Sold" && (
                  <>
                    <button onClick={() => updateStatus(req.Order_ID, "Sold")} className="approve-btn">
                      Approve
                    </button>
                    <button onClick={() => updateStatus(req.Order_ID, "Declined")} className="decline-btn">
                      Decline
                    </button>
                  </>
                )}

                {req.Status === "Sold" && (
                  <button onClick={() => updateStatus(req.Order_ID, "Pending")} className="unapprove-btn">
                    Unapprove
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showToast && (
  <div className="toast-popup">
    {toastMessage}
  </div>
)}

    </>
  );
};

export default ArtistArtwork;
