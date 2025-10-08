import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostContainer from "../components/PostContainer"; // import PostContainer
import "./css/Profile.css"; // reuse same profile CSS
import flowerIcon from "../assets/images/profile-flower.png";


const ProfilePage = () => {
  const { artistId } = useParams(); // gets :artistId from URL
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const artistRes = await axios.get(`http://localhost:5000/artist/${artistId}`);
        setArtist(artistRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [artistId]);

  if (!artist) return <p>Loading profile...</p>;

  return (
    <>
      <Navbar />

      <div className="profile-card">
       <div className="left-section">
  <div className="flower-section">
    <img src={flowerIcon} alt="Flower" />
    {artist.Profile_url && (
      <img
        src={`http://localhost:5000${artist.Profile_url}`}
        alt="Artist Profile"
        className="profile-pic"
      />
    )}
  </div>
</div>


        <div className="user-info">
          <div className="user-header">
            <div>
              <h2 className="user-name">
                {artist.Name} {artist.Surname}
              </h2>
              <p className="user-username">@{artist.Username}</p>
            </div>
          </div>

          <p className="user-bio">{artist.Bio || "No bio yet"}</p>
        </div>
      </div>

      <div className="post-section">
        {/* Reuse PostContainer like Profile.js */}
        <PostContainer artistId={artist.Artist_ID} />
      </div>
    </>
  );
};

export default ProfilePage;
