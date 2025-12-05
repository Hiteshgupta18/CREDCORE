import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './home';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Contact from './Contact';

function AppWrapper() {
  const location = useLocation();

  // Only hide navbar on login and signup pages
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/validation" element={<div>Validation Page</div>} />
        <Route path="/directory" element={<div>Directory Page</div>} />
        <Route path="/schemes" element={<div>Schemes Page</div>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default AppWrapper;