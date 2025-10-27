import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavbarLog from "../components/NavbarLog";

import "./css/Profile.css"; // reuse same profile CSS
import flowerIcon from "../assets/images/profile-flower.png";
import Navbar from "../components/Navbar";
// import { BASE_URL } from "../Config";
import ProfilePostContainer from "../components/ProfilePostContainer";
const BASE_URL= "https://the-bloom-room-5.onrender.com";
const ProfilePage = () => {
  const { artistId } = useParams(); // gets :artistId from URL
  const [artist, setArtist] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [artistUserId, setArtistUserId] = useState(null);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const artistRes = await axios.get(`${BASE_URL}/artist/${artistId}`);
        const art = artistRes.data;
        setArtist(art);
        // if artist record includes User_ID, fetch user status
        const userIdForArtist = art.User_ID || art.UserId || art.user_id || null;
        if (userIdForArtist) {
          setArtistUserId(userIdForArtist);
          try {
            const userRes = await axios.get(`${BASE_URL}/users/${userIdForArtist}`);
            const userObj = userRes.data.user;
            setApprovalStatus(userObj.Status === 'verified' ? 'approved' : 'none');
          } catch (e) {
            console.warn('Could not fetch artist user status', e);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [artistId]);

  if (!artist) return <p>Loading profile...</p>;


// Top of your component
let attributes = [];

try {
  if (artist && artist.Account_Attributes) {
    console.log("Raw artist attributes:", artist.Account_Attributes);

    let parsed = artist.Account_Attributes;

    // Parse once if it's a string
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
      console.log("First parse result:", parsed);
    }

    // If still a string (double-encoded), parse again
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
      console.log("Second parse result:", parsed);
    }

    // Finally, check if it's an array
    if (Array.isArray(parsed)) {
      attributes = parsed;
    } else {
      console.warn("Artist attributes parsed but not array, resetting to []");
      attributes = [];
    }
  }
} catch (error) {
  console.error("Error parsing artist attributes:", error);
  attributes = [];
}






  return (
    <>
      <Navbar />

      <div className="profile-card">
       <div className="left-section">
  <div className="flower-section">
    <img src={flowerIcon} alt="Flower" />
    {artist.Profile_url && (
      <div className="profile-pic-wrapper">
        <img
          src={artist.Profile_url}
          alt="Artist Profile"
          className="profile-pic"
        />
        {approvalStatus === 'approved' && (
          <div className="profile-verified-indicator">✓</div>
        )}
      </div>
    )}
  </div>
</div>


        <div className="user-info">
          <div className="user-header">
            <div>
              <h2 className="user-name">
                {artist.Name} {artist.Surname}
                {approvalStatus === 'approved' && (
                  <span className="verified-badge">Verified</span>
                )}
              </h2>
              <p className="user-username">@{artist.Username}</p>
            </div>
          </div>

             <div className="user-adjectives">
  {attributes.length > 0 ? (
    attributes.map((attr, index) => (
      <span key={index} className="adjective">
        {attr}
      </span>
    ))
  ) : (
    <span className="no-attributes">No attributes yet</span>
  )}
</div>




          <p className="user-bio">{artist.Bio || "No bio yet"}</p>
        </div>
      </div>

      <div className="post-section">
        {/* Reuse PostContainer like Profile.js */}
        <ProfilePostContainer artistId={artist.Artist_ID} />
      </div>
    </>
  );
};

export default ProfilePage;
