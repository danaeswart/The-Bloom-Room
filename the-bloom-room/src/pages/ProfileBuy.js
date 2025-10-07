import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarBuy from "../components/NavbarBuy";
import "./css/ProfileBuy.css";
import flowerIcon from "../assets/images/profile-flower.png";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

const ProfileBuy = () => {
  const [buyerData, setBuyerData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [email, setEmail] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const userID = user?.User_ID;
useEffect(() => {
  const fetchBuyerData = async () => {
    if (!userID) return;

    try {
      console.log("user id we got bitch", userID);

      // Fetch base user info
      const userRes = await axios.get(`http://localhost:5000/users/${userID}`);
      
      const updatedUser = userRes.data.user;
        console.log("Updated user:", updatedUser);

         // Update state with fetched data
      setName(updatedUser.Name);
      setSurname(updatedUser.Surname);
      setEmail(updatedUser.Email);

      // ✅ Fetch buyer-specific info
      const buyerRes = await axios.get(`http://localhost:5000/buyer/${userID}`);
      console.log("Buyer data response:", buyerRes.data);
      const buyerData = buyerRes.data; // no .buyer here

      console.log("Buyer data received:", buyerData);

     

      // From buyer table
      setProfileUrl(buyerData.Profile_url);
      setBio(buyerData.Bio);

      // Save states
      setUser(updatedUser);
      setBuyerData(buyerData);
    } catch (err) {
      console.error("Error fetching buyer profile data:", err);
    }
  };

  fetchBuyerData();
}, [userID]);



  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleProfileImageChange = (e) => {
    setProfileUrl(e.target.files[0]);
  };

  const handleSave = async () => {
  console.log("=== Saving buyer profile changes ===");

  try {
    // Update user base info (name, surname, email)
    const userData = { name, surname, email };
    await axios.put(`http://localhost:5000/users/${userID}`, userData);

    // Update buyer bio
    await axios.put(`http://localhost:5000/buyer/${userID}`, { bio });

    // Update profile picture if changed
    if (profileUrl instanceof File) {
      const formData = new FormData();
      formData.append("profile_url", profileUrl);
      await axios.put(`http://localhost:5000/users/profile/${userID}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    // Refresh both user + buyer data after saving
    const userRes = await axios.get(`http://localhost:5000/users/${userID}`);
    const buyerRes = await axios.get(`http://localhost:5000/buyer/${userID}`);

    setUser(userRes.data.user);
    setBuyerData(buyerRes.data.buyer);
    setBio(buyerRes.data.buyer.Bio || "");
    setProfileUrl(buyerRes.data.buyer.Profile_url || "");

    setIsEditing(false);
  } catch (error) {
    console.error("❌ Error updating buyer profile:", error);
    alert("Something went wrong while saving your changes.");
  }
};

  const handleLogout = () => {
    console.log("Logging out...");
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <NavbarBuy />

      <div className="profile-card" style={{ marginTop: "5rem" }}>
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

          {isEditing ? (
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="edit-bio" />
          ) : (
            <p className="user-bio">{bio || "No bio yet"}</p>
          )}

          {isEditing && (
            <div className="follow-group">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileBuy;
