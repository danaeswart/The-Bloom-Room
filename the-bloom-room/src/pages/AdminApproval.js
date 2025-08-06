import React, { useState } from "react";
import "./css/AdminApproval.css"; // New CSS file for admin page
import NavBar from "../components/Navbar";

const dummyArtist = {
  name: "Jane Doe",
  location: "New York, USA",
  bio: "Contemporary artist specializing in mixed media.",
  artworks: [
    "https://picsum.photos/id/1011/400/300",
    "https://picsum.photos/id/1015/400/300",
    "https://picsum.photos/id/1021/400/300",
  ],
  email: "janedoe@example.com",
  website: "https://janedoeart.com",
  social: "@janedoeart",
};

function AdminApproval() {
  const [artist] = useState(dummyArtist);
  const [approved, setApproved] = useState(null); // null | true | false

  const handleApprove = () => setApproved(true);
  const handleReject = () => setApproved(false);

  return (
    <>
      <NavBar />
      <div className="approval-page">
        <div className="left-panel">
          <h2 className="section-title">Artist Artworks</h2>
          <div className="images-container">
            <div className="images-scroll">
              {artist.artworks.map((src, i) => (
                <img key={i} src={src} alt={`artwork ${i}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="right-panel">
          <h2 className="section-title">Approve Artist Account</h2>
          <div className="artist-info">
            <p><strong>Name:</strong> {artist.name}</p>
            <p><strong>Location:</strong> {artist.location}</p>
            <p><strong>Bio:</strong> {artist.bio}</p>
            <p><strong>Email:</strong> {artist.email}</p>
            <p>
              <strong>Website:</strong>{" "}
              <a href={artist.website} target="_blank" rel="noreferrer">
                {artist.website}
              </a>
            </p>
            <p><strong>Social:</strong> {artist.social}</p>
          </div>

          <div className="button-group">
            <button
              className={`approve-btn ${approved === true ? "active" : ""}`}
              onClick={handleApprove}
            >
              Approve
            </button>
            <button
              className={`reject-btn ${approved === false ? "active" : ""}`}
              onClick={handleReject}
            >
              Reject
            </button>
          </div>

          {approved !== null && (
            <p
              className={`approval-status ${approved ? "approved" : "rejected"}`}
            >
              Artist has been {approved ? "approved ✅" : "rejected ❌"}.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminApproval;
