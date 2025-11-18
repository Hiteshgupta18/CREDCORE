import React from "react";
import { Link } from "react-router-dom";
import CrediCoreLogo from "./CrediCoreLogo.jpg";

function Navbar() {
  return (
    <nav id="main-nav">
      <div className="nav-container container">
        <Link to="/" className="logo-link">
          <img src={CrediCoreLogo} alt="CrediCore Logo" className="logo" />
          <span className="brand-name">CrediCore</span>
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/validation">Hospital Validation</Link></li>
          <li><Link to="/address-validation">Address Validation</Link></li>
          <li><Link to="/directory">Directory</Link></li>
          <li><Link to="/schemes">Schemes</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <Link to="/login" className="login-button">Login / Sign Up</Link>
      </div>
    </nav>
  );
}

export default Navbar;