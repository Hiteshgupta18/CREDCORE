import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CrediCoreLogo from "./CrediCoreLogo.jpg";

const API_URL = 'http://localhost:5000/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus({ type: '', message: '' });
    
    try {
      const response = await axios.post(`${API_URL}/contact`, formData);
      
      if (response.data.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message! We will get back to you soon.'
        });
        setFormData({
          fullName: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit message. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Contact Page Section */}
      <section id="contact-page" className="container">
        <h1>Get in Touch with the CrediCore Team 👋</h1>
        <p className="intro-text">
          Have a question about the AI model, compliance, or future integration? Send us a message!
        </p>

        <div className="contact-layout">
          {/* Contact Form */}
          <div className="contact-card">
            <h2>Send Us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="demo">Request a Demo</option>
                  <option value="integration">Integration Inquiry</option>
                  <option value="feedback">Feedback / Suggestion</option>
                  <option value="general">General Question</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Your message here..."
                  required
                ></textarea>
              </div>

              {submitStatus.message && (
                <div className={`alert alert-${submitStatus.type}`}>
                  {submitStatus.message}
                </div>
              )}

              <button type="submit" className="submit-contact-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="info-card">
            <h2>Our Contact Info</h2>

            <div className="contact-detail">
              <p className="detail-title">Email Us</p>
              <p className="detail-value">credicore.team@eyhackathon.com</p>
            </div>

            <div className="contact-detail">
              <p className="detail-title">Hackathon Role</p>
              <p className="detail-value">
                PS #10 Provider Data Validation and Directory Management Agent
              </p>
            </div>

            <div className="contact-detail">
              <p className="detail-title">Team Location</p>
              <p className="detail-value">EY Innovation Labs (Hypothetical)</p>
            </div>

            <div className="visual-aid">
              <p>We look forward to connecting!</p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Footer */}
      <footer>
        <div className="container">
          <p>© EY Hackathon Project - CrediCore Team</p>
        </div>
      </footer>
    </>
  );
}
