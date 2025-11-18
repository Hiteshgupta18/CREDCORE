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


import React from "react";
import { Link, useNavigate } from "react-router-dom";
import CrediCoreLogo from "./CrediCoreLogo.jpg";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard"); // Redirect after login
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

      {/* ✅ Login UI below */}
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
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" required placeholder="name@example.com" />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input type="password" required placeholder="********" />
                </div>

                <button className="cta-submit-button primary">Sign In</button>
              </form>

              <p className="toggle-link">
                New here? <Link to="/signup">Create an Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
