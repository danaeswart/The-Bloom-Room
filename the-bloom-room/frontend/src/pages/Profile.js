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
import { BASE_URL } from "../Config";

const Profile = () => {
  const [artistData, setArtistData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [userArtworks, setUserArtworks] = useState([]);
  const [artistID, setArtistID] = useState(null);
const [profileFile, setProfileFile] = useState(null); // holds the selected file

  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const userID = user?.User_ID;

  // FETCH ARTIST DATA
  useEffect(() => {
    const fetchProfileData = async () => {
      console.log("who we have", userID);
      if (!userID) return;

      try {
        
        
        // 2. Fetch user data
        const userRes = await axios.get(`${BASE_URL}/users/${userID}`);
        const updatedUser = userRes.data.user;
        console.log("User data received:", updatedUser);
        console.log("Setting name and surname hoe:", updatedUser.Name, updatedUser.Surname);
        setName(updatedUser.Name );
        setSurname(updatedUser.Surname);
        setUser(updatedUser);


        // 1. Fetch artist data
        const artistRes = await axios.get(`${BASE_URL}/artist/user/${userID}`);
        const artistData = artistRes.data;
         console.log("Artist data received hoe:", artistData);

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

        // console.log("Artist ID set:", artistData.Artist_ID);

        // 3. Fetch artworks for this artist
        console.log("Fetching artworks for artistID:", artistData.Artist_ID);
        const artworksRes = await axios.get(`${BASE_URL}/artwork/user/${artistData.Artist_ID}`);
        console.log("Artworks data received:", artworksRes.data);
        setUserArtworks(artworksRes.data);
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

  const handleProfileImageChange = (e) => {
    setProfileFile(e.target.files[0]);
  };

  const handleSave = async () => {
  console.log("=== Saving profile changes ===");

  try {
    // 1. Update basic user info
    await axios.put(`${BASE_URL}/users/${userID}`, { name, surname });

    // 2. Upload profile image if selected
    let uploadedProfileUrl = profileUrl;
    console.log("Profile file to upload:----------", profileFile);
    console.log("baseurl", BASE_URL);
    if (profileFile && artistID) {
  const formData = new FormData();
  formData.append("file", profileFile);
  console.log("Uploading profile image for artistID:", artistID);

  const res = await axios.post(
    `${BASE_URL}/artist/upload-profile/${artistID}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  console.log("Uploaded profile URL:", res.data.profileUrl);
  setProfileUrl(res.data.profileUrl);
}

    // 3. Update artist info
    const artistFormData = new FormData();
    artistFormData.append("bio", bio);
    artistFormData.append("account_attributes", JSON.stringify(attributes));
    if (uploadedProfileUrl) artistFormData.append("profile_url", uploadedProfileUrl);

    await axios.put(`${BASE_URL}/artist/${artistID}`, artistFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Profile updated successfully");

    // 4. Refresh user
    const userRes = await axios.get(`${BASE_URL}/users/${userID}`);
    setUser(userRes.data.user);

    setIsEditing(false);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    alert("Something went wrong while saving your changes.");
  }
};


  const handleLogout = () => {
    console.log("Logging out...");
    setUser(null);
    localStorage.removeItem("user");
    navigate("/home");
  };

  return (
    <>
      <Navbar />

      <div className="profile-card">
        <div className="left-section">
          <div className="flower-section">
            <img src={flowerIcon} alt="Flower" />
            {profileUrl && (
              <img
  src={
    profileFile
      ? URL.createObjectURL(profileFile) // show selected file
      : profileUrl // fallback to current Cloudinary URL
  }
  alt="User Profile"
  className="profile-pic"
/>
            )}
          </div>
         {isEditing && (
  <>
    <input
      type="file"
      id="profileUpload"
      accept="image/*"
      onChange={(e) => setProfileFile(e.target.files[0])}
      className="profile-upload-input"
    />
    <label htmlFor="profileUpload" className="profile-upload">
      Upload Profile Image
    </label>
  </>
)}
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

      <div className="post-section">
        {artistID ? (
          <>
            <ProfilePostContainer artistId={artistID} />
            <p style={{ fontSize: "12px", color: "gray" }}>
              Debug: Artist ID passed to PostContainer = {artistID}
            </p>
          </>
        ) : (
          <p>Loading artworks...</p>
        )}
      </div>
    </>
  );
};

export default Profile;
