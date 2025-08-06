import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home"; // Assuming you have a Home component
import BloomPost from "./pages/BloomPost";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
         <Route path="/bloompost" element={<BloomPost />} />
      </Routes>
    </Router>
  );
}

export default App;
