import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

const API_URL = 'http://localhost:5000/api';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      firstName: parsedUser.firstName,
      lastName: parsedUser.lastName,
      email: parsedUser.email
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/auth/update-profile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Update localStorage with new user data
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        window.dispatchEvent(new Event('authStateChanged'));
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authStateChanged'));
    alert('You have been logged out successfully!');
    navigate('/');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    setError('');
    setSuccess('');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <h1>{user.firstName} {user.lastName}</h1>
          <p className="profile-role">{user.role}</p>
        </div>

        <div className="profile-content">
          {success && (
            <div className="alert alert-success">
              ✓ {success}
            </div>
          )}
          
          {error && (
            <div className="alert alert-error">
              ✗ {error}
            </div>
          )}

          <div className="profile-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              {!isEditing && (
                <button 
                  className="btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="profile-details">
                <div className="detail-row">
                  <label>First Name</label>
                  <p>{user.firstName}</p>
                </div>
                <div className="detail-row">
                  <label>Last Name</label>
                  <p>{user.lastName}</p>
                </div>
                <div className="detail-row">
                  <label>Email Address</label>
                  <p>{user.email}</p>
                </div>
                <div className="detail-row">
                  <label>Role</label>
                  <p>{user.role}</p>
                </div>
                <div className="detail-row">
                  <label>Member Since</label>
                  <p>{new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="profile-edit-form">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your first name"
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
                    placeholder="Enter your last name"
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
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-save"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="profile-actions">
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
