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


import React from "react";
import { Link } from "react-router-dom";
import CrediCoreLogo from "./CrediCoreLogo.jpg";

export default function Signup() {
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
            <form>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" required placeholder="Your Name" />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required placeholder="name@example.com" />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input type="password" required placeholder="Min 8 characters" />
              </div>

              <button className="cta-submit-button primary">Sign Up</button>
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
