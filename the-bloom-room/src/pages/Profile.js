
import axios from "axios";
import { useLocation } from "react-router-dom";
import NavbarLog from "../components/NavbarLog";
import PostContainer from "../components/PostContainer";
import "./css/Profile.css";
import flowerIcon from "../assets/images/profile-flower.png";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext"; // Adjust path if needed


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



  const location = useLocation();
  // const user = location.state?.user;
 
    const { user, setUser } = useContext(UserContext);
     const userID = user?.User_ID;

// FETCH ARTIST DATA
 useEffect(() => {
  const fetchProfileData = async () => {
    if (!userID) return; // Wait for userID

    try {
      // 1. Fetch artist data
      const artistRes = await axios.get(`http://localhost:5000/artist/${userID}`);
      const artistData = artistRes.data;

      let attrs = [];
      if (artistData.Account_Attributes) {
        try {
          attrs = JSON.parse(artistData.Account_Attributes);
          if (typeof attrs === "string") attrs = JSON.parse(attrs);
          if (!Array.isArray(attrs)) attrs = [attrs];
        } catch (err) {
          console.error("Error parsing attributes:", err);
        }
      }
      setAttributes(attrs || []);
      setBio(artistData.Bio || "");
      setProfileUrl(artistData.Profile_url || "");
      setArtistID(artistData.Artist_ID);

      

      // 2. Fetch user data
      const userRes = await axios.get(`http://localhost:5000/users/${userID}`);
      const updatedUser = userRes.data.user;
      setName(updatedUser.Name || "");
      setSurname(updatedUser.Surname || "");
      setUser(updatedUser);

      // 3. Fetch artworks for this user
      const artworksRes = await axios.get(`http://localhost:5000/artworks/user/${userID}`);
      setUserArtworks(artworksRes.data);

    } catch (err) {
      console.error("Error fetching profile data:", err);
    }
  };

  fetchProfileData();
}, [userID]);


  
useEffect(() => {
  const fetchUserArtworks = async () => {
    if (!userID) return;

    try {
      const res = await axios.get(`http://localhost:5000/artworks/user/${userID}`);
       console.log("User artworks data:", res.data); // ✅ Debug here
      setUserArtworks(res.data);
    } catch (err) {
      console.error("Error fetching user artworks:", err);
    }
  };

  fetchUserArtworks();
}, [userID]);



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
    setProfileUrl(e.target.files[0]);
  };



  const handleSave = async () => {
    console.log("=== Saving profile changes ===");
    console.log("User ID:", userID);

    try {
      // Update Users table
      const userData = {
        name,
        surname,
      };
      console.log("Sending PUT request to:", `http://localhost:5000/users/${userID}`);
      console.log("User data being sent:", userData);
      await axios.put(`http://localhost:5000/users/${userID}`, userData);

      // Update Artist table
      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("account_attributes", JSON.stringify(attributes));

      //-------------- this code works for update
      // if (profileUrl instanceof File) {
      //   formData.append("profile_url", profileUrl);
      // } else {
      //   formData.append("profile_url", profileUrl || "");
      // }
      if (profileUrl instanceof File) {
  formData.append("profile_url", profileUrl);
} else if (profileUrl) {
  formData.append("profile_url", profileUrl);
}


      console.log("Sending PUT request to:", `http://localhost:5000/artist/${userID}`);
      console.log("Artist data being sent:", formData);

      await axios.put(`http://localhost:5000/artist/${userID}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Profile updated successfully (users + artist)");

       // ✅ NEW: Fetch updated user and update context
    const userRes = await axios.get(`http://localhost:5000/users/${userID}`);
    const updatedUser = userRes.data.user;
    setUser(updatedUser); // ← THIS updates context


      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("Something went wrong while saving your changes.");
    }
  };

  return (
    <>
      <NavbarLog />

      <div className="profile-card">
        {/* Left Section */}
        <div className="left-section">
          <div className="flower-section">
            <img src={flowerIcon} alt="Flower" />
            {profileUrl && (
              <img
                src={typeof profileUrl === "string" ? profileUrl : URL.createObjectURL(profileUrl)}
                alt="User Profile"
                className="profile-pic"
              />
            )}
          </div>
          {isEditing && <input type="file" onChange={handleProfileImageChange} />}
        </div>

        {/* Right Section */}
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
            <button className="follow-btn" onClick={toggleEdit}>
              {isEditing ? "Cancel" : "Edit"}
            </button>
                    </div>
         <div className="user-adjectives">
  {attributes.length > 0 ? (
    attributes.map((attr, index) =>
      isEditing ? (
        <div
          key={index}
          className="attribute-edit"
          style={{ display: "flex", gap: "5px", alignItems: "center" }}
        >
          <input
            value={attr}
            onChange={(e) => handleAttributeChange(index, e.target.value)}
            className="attribute-input"
          />
          <button
            className="attribute-remove"
            onClick={() => handleRemoveAttribute(index)}
          >
            ❌
          </button>
        </div>
      ) : (
        <span key={index} className="adjective">
          {attr}
        </span>
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

          {/* Bio */}
          {isEditing ? (
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="edit-bio" />
          ) : (
            <p className="user-bio">{bio || "No bio yet"}</p>
          )}

          {/* Save Button */}
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
       <PostContainer userId={artistID} />
      </div>
    </>
  );
};

export default Profile;
