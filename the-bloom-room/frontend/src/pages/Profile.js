import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarLog from "../components/NavbarLog";

import "./css/Profile.css";
import flowerIcon from "../assets/images/profile-flower.png";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext"; // Adjust path if needed
import { Link } from "react-router-dom";
import ProfilePostContainer from "../components/ProfilePostContainer";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// import { BASE_URL } from "../Config";


const BASE_URL= "https://the-bloom-room-5.onrender.com";

const Profile = () => {
  const [artistData, setArtistData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [userArtworks, setUserArtworks] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState(null); // null | 'none' | 'pending' | 'approved'
  const [artistID, setArtistID] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const userID = user?.User_ID;

  // FETCH ARTIST DATA
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userID) return;

      try {
        
        
        // 2. Fetch user data
        const userRes = await axios.get(`${BASE_URL}/users/${userID}`);
        const updatedUser = userRes.data.user;
        setName(updatedUser.Name );
        setSurname(updatedUser.Surname);
        setUser(updatedUser);


        // 1. Fetch artist data
        const artistRes = await axios.get(`${BASE_URL}/artist/user/${userID}`);
        const artistData = artistRes.data;

        let attrs = [];
if (artistData.Account_Attributes) {
  try {
    attrs = JSON.parse(artistData.Account_Attributes); // first parse
    if (typeof attrs === "string") attrs = JSON.parse(attrs); // parse again if double-encoded
    if (!Array.isArray(attrs)) attrs = [attrs];
  } catch (err) {
    console.error("Error parsing attributes:", err);
  }
}
setAttributes(attrs);
        setBio(artistData.Bio || "");
        setProfileUrl(artistData.Profile_url || "");
        setArtistID(artistData.Artist_ID);

        // 3. Fetch artworks for this artist
        const artworksRes = await axios.get(`${BASE_URL}/artwork/user/${artistData.Artist_ID}`);
        setUserArtworks(artworksRes.data);

        // check for any pending approval for this user
        try {
          const pendingRes = await axios.get(`${BASE_URL}/admin/verification/requests`);
          const pending = (pendingRes.data.requests || []).find(r => r.User_ID === userID);
          
          if (pending) {
            setApprovalStatus('pending');
          } else if (updatedUser.Status === 'verified') {
            setApprovalStatus('approved');
            console.log("Set approval status to: approved");
          } else {
            setApprovalStatus('none');
            console.log("Set approval status to: none");
          }
        } catch (e) {
          console.warn('Could not fetch pending approvals', e);
          if (updatedUser.Status === 'verified') {
            setApprovalStatus('approved');
          } else {
            setApprovalStatus('none');
          }
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [userID]);

  // useEffect(() => {
  //   const fetchUserArtworks = async () => {
  //     if (!userID) return;

  //     try {
  //       console.log("Fetching artworks in second useEffect for userID:", userID);
  //       const res = await axios.get(`${BASE_URL}/artwork/user/${userID}`);
  //       console.log("User artworks data:", res.data);
  //       setUserArtworks(res.data);
  //     } catch (err) {
  //       console.error("Error fetching user artworks:", err);
  //     }
  //   };

  //   fetchUserArtworks();
  // }, [userID]);

  const handleAttributeChange = (index, value) => {
    const newAttrs = [...attributes];
    newAttrs[index] = value;
    setAttributes(newAttrs);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, ""]);
  };

  const handleRemoveAttribute = (index) => {
    const newAttrs = attributes.filter((_, i) => i !== index);
    setAttributes(newAttrs);
  };

  const handleSave = async () => {
  try {
    // 1. Update basic user info
    await axios.put(`${BASE_URL}/users/${userID}`, { name, surname });

    // 2. Update artist info
    const artistFormData = new FormData();
    artistFormData.append("bio", bio);
    artistFormData.append("account_attributes", JSON.stringify(attributes));
    if (profileUrl) artistFormData.append("profile_url", profileUrl);

    await axios.put(`${BASE_URL}/artist/${artistID}`, artistFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // 3. Refresh user
    const userRes = await axios.get(`${BASE_URL}/users/${userID}`);
    setUser(userRes.data.user);

    setIsEditing(false);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    alert("Something went wrong while saving your changes.");
  }
};


  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/home");
  };

  const handleRequestVerification = async () => {
    if (!userID) return;
    try {
      setApprovalStatus('pending');
      const res = await axios.post(`${BASE_URL}/admin/verification/request`, { user_id: userID });
      setApprovalStatus('pending');
    } catch (err) {
      console.error('Error requesting verification:', err);
      alert(err.response?.data?.message || 'Could not request verification');
      setApprovalStatus('none');
    }
  };

  return (
    <>
      <Navbar />

      <div className="profile-card">
        <div className="left-section">
          <div className="flower-section">
            <img src={flowerIcon} alt="Flower" />
            {profileUrl && (
              <div className="profile-pic-wrapper">
                <img
                  src={profileUrl}
                  alt="User Profile"
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
              {isEditing ? (
                <>
                  <input value={name} onChange={(e) => setName(e.target.value)} />
                  <input value={surname} onChange={(e) => setSurname(e.target.value)} />
                </>
              ) : (
                <h2 className="user-name">
                  {name} {surname}
                  {/* Verified checkmark icon */}
                  {approvalStatus === 'approved' && (
                    <span className="verified-check-icon">✓</span>
                  )}
                </h2>
              )}
              <p className="user-username">@{user?.Username}</p>
            </div>

            <div className="profile-buttons">
              <button className="follow-btn" onClick={toggleEdit}>
                {isEditing ? "Cancel" : "Edit"}
              </button>

              <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </div>

          <div className="user-adjectives">
            {attributes.length > 0 ? (
              attributes.map((attr, index) =>
                isEditing ? (
                  <div key={index} className="attribute-edit" style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    <input value={attr} onChange={(e) => handleAttributeChange(index, e.target.value)} className="attribute-input" />
                    <button className="attribute-remove" onClick={() => handleRemoveAttribute(index)}>
                      ❌
                    </button>
                  </div>
                ) : (
                  <span key={index} className="adjective">{attr}</span>
                )
              )
            ) : (
              !isEditing && <span className="no-attributes">No attributes yet</span>
            )}
            {isEditing && (
              <button className="attribute-add" onClick={handleAddAttribute}>
                Add Attribute
              </button>
            )}
          </div>

          {isEditing ? (
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="edit-bio" />
          ) : (
            <p className="user-bio">{bio || "No bio yet"}</p>
          )}

          {isEditing && (
            <div className="follow-group">
              <button className="share-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="action-center">
        {artistID && approvalStatus !== 'approved' && (
          <div className="verification-section">
            {approvalStatus === 'pending' ? (
              <div className="pending-verification">
                <span></span>
                Verification request pending review
              </div>
            ) : (
              <div>
                {userArtworks && userArtworks.length >= 5 ? (
                  <>
                    <p className="verification-text">You've posted 5+ artworks. You may request verification from an admin.</p>
                    <button onClick={handleRequestVerification} className="request-verify-btn">
                      Request Verification
                    </button>
                  </>
                ) : (
                  <p className="verification-text">Post 5+ artworks to request verification.</p>
                )}
              </div>
            )}
          </div>
        )}
        
        <Link to="/bloompost">
          <button className="bloom-post-btn">
            Create New Bloom Post
          </button>
        </Link>
      </div>

      <div className="post-section">
        {artistID ? (
          <ProfilePostContainer artistId={artistID} />
        ) : (
          <p>Loading artworks...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;
