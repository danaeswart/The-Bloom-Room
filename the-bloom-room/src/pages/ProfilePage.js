import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  const { artistId } = useParams(); // gets :artistId from URL
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const artistRes = await axios.get(`http://localhost:5000/artist/${artistId}`);
      setArtist(artistRes.data);

      const artworksRes = await axios.get(`http://localhost:5000/artworks/user/${artistId}`);
      setArtworks(artworksRes.data);
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
     <div className="profile-info">
  <img src={`http://localhost:5000${artist.Profile_url}`} alt="Profile" />
  <h2>{artist.Name} {artist.Surname}</h2>
  <h3>@{artist.Username}</h3>
  <p>{artist.Bio}</p>
</div>

<div className="artist-artworks">
  {artworks.map(art => (
    <div key={art.Artwork_ID}>
      <img src={`http://localhost:5000${art.Image_URL}`} alt={art.Artwork_Name} />
      <h4>{art.Artwork_Name}</h4>
      <p>R{art.Price}</p>
    </div>
  ))}
</div>

    </>
  );
};

export default ProfilePage;
