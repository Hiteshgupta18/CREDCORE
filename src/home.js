import React from "react";
import "./style.css";
import CrediCoreLogo from "./CrediCoreLogo.jpg";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function Home() {
  return (
    <div className="home-page">
      <section id="hero-section" className="container">
        <div className="hero-left">
          <p className="tagline">
            AI-Powered Healthcare Provider Validation & Directory Management
          </p>

          <h1>
            Verify providers, clean data, and help payers ensure directory
            <strong> Accuracy </strong> and <strong> Compliance</strong>.
          </h1>

          <div className="hero-buttons">
            <Link to="/validation" className="cta-button primary">
              Check Provider Status
            </Link>
            <Link to="/directory" className="cta-button secondary">
              Find Validation Workflow
            </Link>
          </div>

          <div className="feature-cards">
            <div className="card">
              <div className="card-number">1</div>
              <h4 className="card-title">Automated Validation</h4>
              <p className="card-description">
                Intelligent web scraping and APIs to verify crucial provider details.
              </p>
            </div>

            <div className="card">
              <div className="card-number">2</div>
              <h4 className="card-title">Address Verification</h4>
              <p className="card-description">
                Match provider locations using <strong>Jaccard similarity</strong> and geocoding.
              </p>
            </div>

            <div className="card">
              <div className="card-number">3</div>
              <h4 className="card-title">Compliance Matching</h4>
              <p className="card-description">
                Identify discrepancies and flag records for <strong>Smart Alerts</strong> review.
              </p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="image-box">
            <img
              src={CrediCoreLogo}
              alt="Provider Dashboard Screenshot"
              className="tool-screenshot"
            />
          </div>
        </div>
      </section>

      <section id="introduction" className="content-section container">
        <h3>Background</h3>
        <p>
          Healthcare payers often maintain large provider directories, but studies show that
          over 80% contain inaccurate or outdated information such as wrong addresses, contact details,
          and credentials.
        </p>
      </section>

      <section id="challenge" className="content-section container">
        <h3>The Challenge</h3>
        <p>
          Design an AI-driven system that automates provider data validation and updates across 
          multiple healthcare platforms, ensuring accuracy & compliance.
        </p>
      </section>

      <section id="goals" className="content-section container">
        <h3>Goals and Features</h3>
        <ul>
          <li><strong>Automated Validation:</strong> Web scraping + APIs</li>
          <li><strong>Data Accuracy:</strong> Sync across platforms</li>
          <li><strong>Smart Alerts:</strong> Flag incorrect records</li>
          <li><strong>Unified Directory:</strong> Single source of truth</li>
          <li><strong>Synthetic Data:</strong> Realistic training</li>
        </ul>
      </section>

      <footer>
        <div className="container">
          <p>© CrediCore Team</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
