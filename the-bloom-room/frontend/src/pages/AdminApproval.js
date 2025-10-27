import React, { useEffect, useState } from "react";
import "./css/AdminApproval.css";
import NavBar from "../components/Navbar";
import { BASE_URL } from "../Config";
import { useNavigate } from "react-router-dom";

function AdminApproval() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/verification/requests`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch");
      setRequests(json.requests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(approvalId, action) {
    // For now we send a dummy admin_user_id; in a real app you'd use authenticated admin id
    const adminUserId = 8; // change to a valid admin user id in your DB or pass real auth
    const endpoint = action === "approve" ? "approve" : "decline";
    try {
      const res = await fetch(`${BASE_URL}/admin/verification/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approval_id: approvalId, admin_user_id: adminUserId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Action failed");
      // refresh list
      fetchRequests();
    } catch (err) {
      alert("Action failed: " + err.message);
    }
  }

  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <>
      <NavBar />
      <div className="approval-page">
        <h2 className="section-title">Artist Verification Requests</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && requests.length === 0 && <p>No pending requests.</p>}
        <div className="requests-container">
          {requests.map((req) => (
            <div key={req.Approval_ID} className="request-card">
              <div className="artist-header">
                <h3 onClick={() => navigateToProfile(req.User_ID)} className="artist-username">
                  {req.Username}
                </h3>
                <p className="artist-name">{req.Name} {req.Surname}</p>
                <p className="artist-email">{req.Email}</p>
              </div>
              
              <div className="artist-profile-info">
                <h4>Profile Information</h4>
                <p>{req.Bio || "No bio provided"}</p>
              </div>

              <div className="artist-artworks">
                <h4>Recent Artworks</h4>
                <div className="artwork-grid">
                  {(req.artworks || []).slice(0, 3).map((a, i) => (
                    <img
                      key={i}
                      src={a.Image_URL || "https://via.placeholder.com/300x200?text=no+image"}
                      alt={`art-${i}`}
                      className="artwork-preview"
                    />
                  ))}
                </div>
              </div>

              <div className="action-buttons">
                <button className="approve-btn" onClick={() => handleAction(req.Approval_ID, "approve")}>
                  Approve
                </button>
                <button className="reject-btn" onClick={() => handleAction(req.Approval_ID, "decline")}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminApproval;
