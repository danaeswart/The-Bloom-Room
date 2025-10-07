import React, { useContext } from "react"; // ✅ need useContext

import PostContainer from "../components/PostContainer"; 
import logo from "../assets/images/logo.png";
import "./css/Home.css";

import { UserContext } from "../context/UserContext"; // ✅ import context
import NavbarBuy from  "../components/NavbarBuy";

const HomeBuy = () => {
  const { user } = useContext(UserContext); // ✅ pull from global context
  console.log("HomeBuy user from context:", user);

  return (
    <>
     
      <NavbarBuy user={user} />
      <div className="home-content">
        <h1>Welcome Home Buy, {user?.Name || "Guest"}</h1>
        <h2>Here's some art that's worth the watch:</h2>

        <div className="post-section">
          <PostContainer />
        </div>

        <button className="bloom-button">Create a Bloom Post</button>
      </div>
    </>
  );
};

export default HomeBuy;
