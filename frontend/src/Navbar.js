import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import CrediCoreLogo from "./CrediCoreLogo.jpg";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = () => {
      const userData = localStorage.getItem('user');
      setUser(userData ? JSON.parse(userData) : null);
    };

    checkUser();

    // Listen for storage changes (login/logout from other tabs or same window)
    const handleStorageChange = () => {
      checkUser();
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-window updates
    window.addEventListener('authStateChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleStorageChange);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event('authStateChanged'));
    alert('You have been logged out successfully!');
    navigate('/');
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

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
        
        {user ? (
          <div className="user-menu" ref={dropdownRef}>
            <button 
              className="user-icon-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="User menu"
            >
              <div className="user-avatar">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <span className="user-name-text">{user.firstName}</span>
              <span className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</span>
            </button>
            
            {dropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="user-avatar-large">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <div className="user-info">
                    <p className="user-full-name">{user.firstName} {user.lastName}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleProfileClick}>
                  <span className="dropdown-icon">👤</span>
                  View Profile
                </button>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <span className="dropdown-icon">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-button">Login / Sign Up</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;