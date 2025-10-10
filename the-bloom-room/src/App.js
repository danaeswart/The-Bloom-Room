import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfileBuy from "./pages/ProfileBuy";
import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import Order from "./pages/Order";  
import SignUp from "./pages/SignUp";
import Home from "./pages/Home"; // Assuming you have a Home component
import BloomPost from "./pages/BloomPost";
import AdminApproval from "./pages/AdminApproval";
import About from "./pages/About";
import Profile from "./pages/Profile";
import ArtworkPage from "./pages/ArtworkPage";
import HomeLog from "./pages/HomeLog";
import { UserProvider } from "./context/UserContext"; // ✅ import UserProvider
import HomeBuy from "./pages/HomeBuy";
import ArtistArtwork from "./pages/ArtistArtworks";

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homelog" element={<HomeLog />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
         <Route path="/bloompost" element={<BloomPost />} />
         <Route path="/adminapproval" element={<AdminApproval />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/artworks/:artworkId" element={<ArtworkPage />} />
        <Route path="/homebuy" element={<HomeBuy />} />
        <Route path="/profilebuy" element={<ProfileBuy />} />
        <Route path="/profile/:artistId" element={<ProfilePage />} />
        <Route path="/order/:artworkId" element={<Order />} />
        <Route path="/artistartworks/:artworkId" element={<ArtistArtwork />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
