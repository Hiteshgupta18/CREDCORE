import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./style.css";
import HomePage from "./home";
import Dashboard from "./Dashboard";
import Contact from "./Contact";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import Navbar from "./Navbar";
import HospitalValidation from "./HospitalValidation";
import Directory from "./Directory";
import Schemes from "./Schemes";
import JaccardTest from "./components/JaccardTest";
import MapTest from "./components/MapTest";
import DataViewer from "./components/DataViewer";
import Chatbot from "./components/chatbot/chatbot";

function AppWrapper() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Chatbot />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/address-validation" element={<JaccardTest />} />
        <Route path="/validation" element={<HospitalValidation />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/map-test" element={<MapTest />} />
        <Route path="/data-viewer" element={<DataViewer />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;