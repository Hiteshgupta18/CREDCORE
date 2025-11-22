// import React from "react";
// import { Link } from "react-router-dom";
// import CrediCoreLogo from "./CrediCoreLogo.jpg";

// export default function Signup() {
//   return (
//     <div className="auth-body">
//       <div className="auth-container">
//         <header className="auth-header">
//           <Link to="/" className="logo-link">
//             <img src={CrediCoreLogo} alt="CrediCore Logo" className="logo" />
//             <span className="brand-name">CrediCore</span>
//           </Link>
//           <h2>Create New Account</h2>
//         </header>

//         <div className="auth-form active">
//           <h3>Create your account</h3>
//           <form>
//             <div className="form-group">
//               <label>Full Name</label>
//               <input type="text" required placeholder="Your Name" />
//             </div>

//             <div className="form-group">
//               <label>Email Address</label>
//               <input type="email" required placeholder="name@example.com" />
//             </div>

//             <div className="form-group">
//               <label>Password</label>
//               <input type="password" required placeholder="Min 8 characters" />
//             </div>

//             <button className="cta-submit-button primary">Sign Up</button>
//           </form>

//           <p className="toggle-link">
//             Already have an account? <Link to="/login">Sign In</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CrediCoreLogo from "./CrediCoreLogo.jpg";

const API_URL = 'http://localhost:5000/api';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      
      if (response.data.success) {
        // Save token and user data to localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Show success message
        alert(`Account created successfully! Welcome, ${response.data.data.user.firstName}!`);
        
        // Redirect to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* ✅ Navbar added */}
      <nav id="main-nav">
        <div className="nav-container container">
          <Link to="/" className="logo-link">
            <img src={CrediCoreLogo} alt="CrediCore Logo" className="logo" />
            <span className="brand-name">CrediCore</span>
          </Link>

          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/validation">Validation</Link></li>
            <li><Link to="/directory">Directory</Link></li>
            <li><Link to="/alerts">Alerts</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>

          <Link to="/login" className="login-button">Login / Sign Up</Link>
        </div>
      </nav>

      {/* ✅ Signup page content */}
      <div className="auth-body">
        <div className="auth-container">
          <header className="auth-header">
            <Link to="/" className="logo-link">
              <img src={CrediCoreLogo} alt="CrediCore Logo" className="logo" />
              <span className="brand-name">CrediCore</span>
            </Link>
            <h2>Create New Account</h2>
          </header>

          <div className="auth-form active">
            <h3>Create your account</h3>
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  padding: '12px',
                  background: '#fee',
                  border: '1px solid #fcc',
                  borderRadius: '6px',
                  color: '#c33',
                  marginBottom: '15px'
                }}>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label>First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                  placeholder="John" 
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                  placeholder="Doe" 
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  placeholder="name@example.com" 
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                  minLength="6"
                  placeholder="Min 6 characters" 
                />
              </div>

              <button 
                className="cta-submit-button primary"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <p className="toggle-link">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
