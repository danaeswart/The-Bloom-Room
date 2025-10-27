import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarBuy from "../components/NavbarBuy";
import "./css/ProfileBuy.css";
import flowerIcon from "../assets/images/profile-flower.png";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import BuyerPostContainer from "../components/BuyerPostContainer";
import Navbar from "../components/Navbar";
// import { BASE_URL } from "../Config";

const BASE_URL= "https://the-bloom-room-5.onrender.com";
const ProfileBuy = () => {
  const [buyerData, setBuyerData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [email, setEmail] = useState("");
  const [buyerID, setBuyerID] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);


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
      const userRes = await axios.get(`${BASE_URL}/users/${userID}`);
      
      const updatedUser = userRes.data.user;
        console.log("Updated user:", updatedUser);

         // Update state with fetched data
      setName(updatedUser.Name);
      setSurname(updatedUser.Surname);
      setEmail(updatedUser.Email);
      console.log("Setting name and surname:", updatedUser.Name, updatedUser.Surname);

      // ✅ Fetch buyer-specific info
      const buyerRes = await axios.get(`${BASE_URL}/buyer/${userID}`);
      
      const buyerData = buyerRes.data; // no .buyer here

      console.log("Buyer data received:", buyerData);

     
      setBuyerID(buyerData.Buyer_ID);
      // From buyer table
      setProfileUrl(buyerData.Profile_url);
      setBio(buyerData.Bio);

      // Save states
      setUser(updatedUser);
      setBuyerData(buyerData);
      // set approval status based on user status and pending requests
      try {
        const pendingRes = await axios.get(`${BASE_URL}/admin/verification/requests`);
        const pending = (pendingRes.data.requests || []).find(r => r.User_ID === userID);
        if (pending) setApprovalStatus('pending');
        else setApprovalStatus(updatedUser.Status === 'verified' ? 'approved' : 'none');
      } catch (e) {
        setApprovalStatus(updatedUser.Status === 'verified' ? 'approved' : 'none');
      }
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
  try {
    // Update base info
    await axios.put(`${BASE_URL}/users/${userID}`, { name, surname, email });

    // Update buyer bio as JSON
    await axios.put(`${BASE_URL}/buyer/${userID}`, { bio });

    // Refresh buyer data
    const buyerRes = await axios.get(`${BASE_URL}/buyer/${userID}`);
    setBuyerData(buyerRes.data);
    setBio(buyerRes.data.Bio || "");
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
      <Navbar />

      <div className="profile-card" style={{ marginTop: "5rem" }}>
        <div className="left-section">
          <div className="flower-section">
            <img src={flowerIcon} alt="Flower" />
            {profileUrl && (
              <div className="profile-pic-wrapper">
                <img
                  src={typeof profileUrl === "string" ? profileUrl : URL.createObjectURL(profileUrl)}
                  alt="User Profile"
                  className="profile-pic"
                />
                {approvalStatus === 'approved' && (
                  <div className="profile-verified-indicator">✓</div>
                )}
              </div>
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
                  {approvalStatus === 'approved' && (
                    <span className="verified-badge">Verified</span>
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
       {buyerID && <BuyerPostContainer buyerId={buyerID} />}
    </>
  );
};

export default ProfileBuy;
