// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import CrediCoreLogo from "./CrediCoreLogo.jpg";

// export default function Login() {
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     navigate("/dashboard"); // Redirect after login
//   };

//   return (
//     <div className="auth-body">
//       <div className="auth-container">
//         <header className="auth-header">
//           <Link to="/" className="logo-link">
//             <img src={CrediCoreLogo} alt="CrediCore Logo" className="logo" />
//             <span className="brand-name">CrediCore</span>
//           </Link>
//           <h2>Provider Data Validation Access</h2>
//         </header>

//         <div className="form-card-wrapper">
//           <div className="auth-form active">
//             <h3>Sign In to CrediCore</h3>
//             <p>Welcome back! Enter your details to access the dashboard.</p>

//             <form onSubmit={handleLogin}>
//               <div className="form-group">
//                 <label>Email Address</label>
//                 <input type="email" required placeholder="name@example.com" />
//               </div>

//               <div className="form-group">
//                 <label>Password</label>
//                 <input type="password" required placeholder="********" />
//               </div>

//               <button className="cta-submit-button primary">Sign In</button>
//             </form>

//             <p className="toggle-link">
//               New here? <Link to="/signup">Create an Account</Link>
//             </p>
//           </div>
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

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      
      if (response.data.success) {
        // Save token and user data to localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Show success message
        alert(`Welcome back, ${response.data.data.user.firstName}!`);
        
        // Trigger auth state change for navbar update
        window.dispatchEvent(new Event('authStateChanged'));
        
        // Redirect to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-body">
      <div className="auth-container">
        <header className="auth-header">
          <Link to="/" className="logo-link">
            <img src={CrediCoreLogo} alt="CrediCore Logo" className="logo" />
            <span className="brand-name">CrediCore</span>
          </Link>
          <h2>Provider Data Validation Access</h2>
        </header>

          <div className="form-card-wrapper">
            <div className="auth-form active">
              <h3>Sign In to CrediCore</h3>
              <p>Welcome back! Enter your details to access the dashboard.</p>

              <form onSubmit={handleLogin}>
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
                    placeholder="********" 
                  />
                </div>

                <button 
                  className="cta-submit-button primary" 
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <p className="toggle-link">
                New here? <Link to="/signup">Create an Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
