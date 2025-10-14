// FeedPage.jsx
import React, { useEffect, useState } from "react";
import PostContainer from "../components/PostContainer"; // Adjust path if needed
import Navbar from "../components/Navbar"; // Optional, if you have a navbar
import "./css/Feed.css"; // Optional, for styling

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);


  return (
    <div className="feed-page">
      <Navbar />
      <div className="feed-container">
        <PostContainer/>
      </div>
    </div>
  );
};

export default Feed;
