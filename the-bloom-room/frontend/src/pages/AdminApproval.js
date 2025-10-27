import React, { useEffect, useState } from "react";
import "./css/AdminApproval.css"; // New CSS file for admin page
import NavBar from "../components/Navbar";
import { BASE_URL } from "../Config";

function AdminApproval() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <>
      <NavBar />
      <div className="approval-page">
        <div className="left-panel">
          <h2 className="section-title">Artist Artworks / Requests</h2>
          <div className="images-container">
            <div className="images-scroll">
              {loading && <p>Loading...</p>}
              {error && <p className="error">{error}</p>}
              {!loading && requests.length === 0 && <p>No pending requests.</p>}
              {requests.map((req) => (
                <div key={req.Approval_ID} style={{ marginRight: 16 }}>
                  <h4>{req.Username}</h4>
                  {(req.artworks || []).map((a, i) => (
                    <img
                      key={i}
                      src={a.Image_URL || "https://via.placeholder.com/300x200?text=no+image"}
                      alt={`art-${i}`}
                      style={{ height: 140, marginBottom: 8, display: "block" }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="right-panel">
          <h2 className="section-title">Pending Requests</h2>
          {loading && <p>Loading...</p>}
          {!loading && requests.length === 0 && <p>No requests to review</p>}
          <div className="artist-info">
            {requests.map((r) => (
              <div key={r.Approval_ID} style={{ marginBottom: 18 }}>
                <p><strong>{r.Username}</strong> ({r.Email})</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button className="approve-btn" onClick={() => handleAction(r.Approval_ID, "approve")}>Approve</button>
                  <button className="reject-btn" onClick={() => handleAction(r.Approval_ID, "decline")}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminApproval;
