import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home"; // Assuming you have a Home component
import BloomPost from "./pages/BloomPost";
import AdminApproval from "./pages/AdminApproval";
import About from "./pages/About";
import Profile from "./pages/Profile";
import ArtworkPage from "./pages/ArtworkPage";
import HomeLog from "./pages/HomeLog";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homelog" element={<HomeLog />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
         <Route path="/bloompost" element={<BloomPost />} />
         <Route path="/adminapproval" element={<AdminApproval />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/artwork/" element={<ArtworkPage />} />
 
      </Routes>
    </Router>
  );
}

export default App;
