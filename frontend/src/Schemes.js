import React, { useState } from 'react';
import './style.css';

function Schemes() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    district: '',
    income: '',
    employment: ''
  });

  const [hasSearched, setHasSearched] = useState(false);
  const [matchingSchemes, setMatchingSchemes] = useState([]);

  // Example schemes data (you can replace this with actual data)
  const availableSchemes = [
    {
      id: 1,
      name: "Ayushman Bharat",
      description: "Comprehensive healthcare coverage for low-income families",
      eligibility: "Income < 3L, Any age",
      coverage: "₹5 lakhs per family per year"
    },
    {
      id: 2,
      name: "CGHS",
      description: "Central Government Health Scheme for government employees",
      eligibility: "Government employees and their families",
      coverage: "Comprehensive healthcare coverage"
    },
    {
      id: 3,
      name: "Senior Citizens Health Insurance",
      description: "Special health coverage for elderly citizens",
      eligibility: "Age 60+, Any income bracket",
      coverage: "Up to ₹3 lakhs per year"
    }
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true);
    
    // Simple matching logic (replace with your actual matching algorithm)
    const matches = availableSchemes.filter(scheme => {
      if (formData.employment === 'government' && scheme.name === 'CGHS') return true;
      if (parseInt(formData.age) >= 60 && scheme.name.includes('Senior')) return true;
      if (formData.income === 'low' && scheme.name.includes('Ayushman')) return true;
      return false;
    });
    
    setMatchingSchemes(matches);
  };

  const handleNotifyUpdates = () => {
    // Implement notification subscription logic
    alert('You will be notified of any updates to health schemes!');
  };

  return (
    <section id="schemes-page" className="container">
      <h1>Find Government Health Schemes You Qualify For</h1>
      <p className="intro-text">Enter basic details to discover matching schemes.</p>

      <div className="schemes-layout">
        <div className="schemes-panel form-panel">
          <h2>Your Details</h2>
          <p className="form-instructions">Fill in your information to find eligible schemes</p>

          <form className="scheme-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleInputChange}
                required
                min="0"
                max="120"
              />
            </div>

            <div className="form-group">
              <label htmlFor="district">District</label>
              <input
                type="text"
                id="district"
                placeholder="Enter your district"
                value={formData.district}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="income">Income Bracket</label>
              <select
                id="income"
                value={formData.income}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select income bracket</option>
                <option value="low">Low</option>
                <option value="middle">Middle</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="employment">Employment Type</label>
              <select
                id="employment"
                value={formData.employment}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select employment type</option>
                <option value="private">Private</option>
                <option value="government">Government</option>
                <option value="self">Self-Employed</option>
              </select>
            </div>

            <button type="submit" className="find-schemes-btn">
              Find Schemes
            </button>
          </form>
        </div>

        <div className={`schemes-panel results-panel ${!hasSearched || matchingSchemes.length === 0 ? 'empty-state' : ''}`}>
          {!hasSearched ? (
            <div className="no-results-message">
              <p>No results yet — enter details and click <strong>Find Schemes</strong>.</p>
            </div>
          ) : matchingSchemes.length === 0 ? (
            <div className="no-results-message">
              <p>No matching schemes found for your criteria.</p>
              <p className="suggestion-text">Try adjusting your details or check back later for new schemes.</p>
            </div>
          ) : (
            <div className="schemes-results">
              <h2>Matching Schemes</h2>
              <div className="schemes-list">
                {matchingSchemes.map(scheme => (
                  <div key={scheme.id} className="scheme-card">
                    <h3>{scheme.name}</h3>
                    <p className="scheme-description">{scheme.description}</p>
                    <div className="scheme-details">
                      <p><strong>Eligibility:</strong> {scheme.eligibility}</p>
                      <p><strong>Coverage:</strong> {scheme.coverage}</p>
                    </div>
                    <button className="learn-more-btn">Learn More</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="results-footer">
            <button 
              className="notify-updates-btn"
              onClick={handleNotifyUpdates}
            >
              Notify Me of Updates (SMS / Email)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Schemes;