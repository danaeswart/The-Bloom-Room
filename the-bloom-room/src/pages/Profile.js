import React from "react";

import Navbar from "../components/Navbar";
import PostContainer from "../components/PostContainer"; // <-- Ensure this exists
import logo from "../assets/images/logo.png";
import "./css/Profile.css";
import userProfile from "../assets/images/user-profile.jpeg";
import flowerIcon from "../assets/images/profile-flower.png";
const Profile = () => {
  return (
    <>
        <Navbar />


         <div className="profile-card">
      {/* Edit Icon */}
    
<div className="left-section">
      {/* Left side - Flower with profile pic in the center */}
      <div className="flower-section">
          <img
            src={flowerIcon}
          />
          <img src={userProfile} alt="User Profile" className="profile-pic" />
        
      </div>
     
      
</div>
      

      {/* Right side - User Info */}
      <div className="user-info">

        <div className="user-header">
            <div>
        <h2 className="user-name">Ben Shaw</h2>
        <p className="user-username">@ben134_0</p>
              </div>
        <button className="follow-btn">
         <h3>Follow</h3>
        </button>

         <div>
        <h2>edit</h2>
      </div>
      
       </div>
       


        {/* Adjectives */}
        <div className="user-adjectives">
          <span className="adjective">Bold</span>
          <span className="adjective">Colorful</span>
          <span className="adjective">Creative</span>
          <span className="adjective">Energetic</span>
        </div>

        {/* Bio */}
        <p className="user-bio">
          Hi! I’m Ben, a designer who loves vibrant colors, bold patterns, and
          unique creative projects. Always exploring new ideas!
        </p>

        {/* Share button */}
        <div className="follow-group">

        
       
        <button className="share-btn">
         <h3> Share Profile</h3>
        </button>
    </div>
        
      </div>
    </div>
      
        <div className="post-section">
        <PostContainer />
       </div>
     
    </>
  );
};

export default Profile;
