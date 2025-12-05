import React from "react";
import "./style.css";
import CrediCoreLogo from "./CrediCoreLogo.jpg";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="dashboard-page">

      <section className="dashboard-content container">
        <div className="dashboard-header">
          <h1>Provider Dashboard</h1>
          <p>Monitor and manage healthcare provider validation status</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Providers</h3>
            <div className="stat-number">2,547</div>
          </div>
          <div className="stat-card">
            <h3>Pending Validation</h3>
            <div className="stat-number">183</div>
          </div>
          <div className="stat-card">
            <h3>Updated Today</h3>
            <div className="stat-number">45</div>
          </div>
        </div>

        <div className="dashboard-main">
          <div className="validation-status">
            <h2>Recent Validations</h2>
            <table className="validation-table">
              <thead>
                <tr>
                  <th>Provider Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dr. John Smith</td>
                  <td>New York, NY</td>
                  <td>Validated</td>
                  <td>Today</td>
                </tr>
                <tr>
                  <td>City Medical Center</td>
                  <td>Boston, MA</td>
                  <td>Pending</td>
                  <td>Yesterday</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="alerts-section">
            <h2>Smart Alerts</h2>
            <div className="alert-items">
              <div className="alert-item">
                <h4>Address Mismatch</h4>
                <p>3 providers have conflicting location information</p>
              </div>
              <div className="alert-item">
                <h4>License Expiring</h4>
                <p>5 providers have licenses expiring within 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>© CrediCore Team</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;