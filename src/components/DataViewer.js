import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataViewer.css';

const API_URL = 'http://localhost:5000/api';

function DataViewer() {
  const [activeTab, setActiveTab] = useState('hospitals');
  const [hospitals, setHospitals] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [validations, setValidations] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      switch (activeTab) {
        case 'hospitals':
          const hospitalsRes = await axios.get(`${API_URL}/hospitals`);
          setHospitals(hospitalsRes.data.data || []);
          break;
        case 'schemes':
          const schemesRes = await axios.get(`${API_URL}/schemes`);
          setSchemes(schemesRes.data.data || []);
          break;
        case 'validations':
          const validationsRes = await axios.get(`${API_URL}/validations`);
          setValidations(validationsRes.data.data || []);
          break;
        case 'addresses':
          const addressesRes = await axios.get(`${API_URL}/addresses`);
          setAddresses(addressesRes.data.data || []);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderHospitals = () => (
    <div className="data-grid">
      {hospitals.map(hospital => (
        <div key={hospital.id} className="data-card">
          <h3>{hospital.name}</h3>
          <div className="data-detail">
            <span className="label">Type:</span>
            <span className={`badge badge-${hospital.hospitalType.toLowerCase()}`}>
              {hospital.hospitalType}
            </span>
          </div>
          <div className="data-detail">
            <span className="label">Status:</span>
            <span className={`badge badge-${hospital.status.toLowerCase()}`}>
              {hospital.status}
            </span>
          </div>
          <div className="data-detail">
            <span className="label">Registration:</span>
            <span>{hospital.registrationNo}</span>
          </div>
          <div className="data-detail">
            <span className="label">Phone:</span>
            <span>{hospital.phone}</span>
          </div>
          <div className="data-detail">
            <span className="label">Verified:</span>
            <span className={hospital.isVerified ? 'verified' : 'not-verified'}>
              {hospital.isVerified ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          {hospital.addresses && hospital.addresses.length > 0 && (
            <div className="data-detail">
              <span className="label">Address:</span>
              <span>{hospital.addresses[0].city}, {hospital.addresses[0].state}</span>
            </div>
          )}
          {hospital.schemes && hospital.schemes.length > 0 && (
            <div className="data-detail">
              <span className="label">Schemes:</span>
              <span>{hospital.schemes.length} enrolled</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSchemes = () => (
    <div className="data-grid">
      {schemes.map(scheme => (
        <div key={scheme.id} className="data-card">
          <h3>{scheme.name}</h3>
          <div className="data-detail">
            <span className="label">Category:</span>
            <span className="badge badge-category">{scheme.category}</span>
          </div>
          <div className="data-detail">
            <span className="label">Eligibility:</span>
            <span>{scheme.eligibility}</span>
          </div>
          <div className="data-detail">
            <span className="label">Benefits:</span>
            <span>{scheme.benefits}</span>
          </div>
          {scheme.description && (
            <div className="data-detail full-width">
              <span className="label">Description:</span>
              <p>{scheme.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderValidations = () => (
    <div className="data-grid">
      {validations.map(validation => (
        <div key={validation.id} className="data-card">
          <h3>Validation #{validation.id.slice(0, 8)}</h3>
          <div className="data-detail">
            <span className="label">Hospital:</span>
            <span>{validation.hospital?.name || 'N/A'}</span>
          </div>
          <div className="data-detail">
            <span className="label">Status:</span>
            <span className={`badge badge-${validation.status.toLowerCase()}`}>
              {validation.status}
            </span>
          </div>
          <div className="data-detail">
            <span className="label">Validator:</span>
            <span>{validation.user?.email || 'N/A'}</span>
          </div>
          <div className="data-detail">
            <span className="label">Score:</span>
            <span>{validation.jaccardScore || 'N/A'}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAddresses = () => (
    <div className="data-grid">
      {addresses.map(address => (
        <div key={address.id} className="data-card">
          <h3>{address.hospital?.name || 'Address'}</h3>
          <div className="data-detail full-width">
            <span className="label">Address:</span>
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
          </div>
          <div className="data-detail">
            <span className="label">City:</span>
            <span>{address.city}</span>
          </div>
          <div className="data-detail">
            <span className="label">State:</span>
            <span>{address.state}</span>
          </div>
          <div className="data-detail">
            <span className="label">Pincode:</span>
            <span>{address.pincode}</span>
          </div>
          <div className="data-detail">
            <span className="label">Primary:</span>
            <span className={address.isPrimary ? 'verified' : ''}>
              {address.isPrimary ? '✓ Yes' : 'No'}
            </span>
          </div>
          <div className="data-detail">
            <span className="label">Verified:</span>
            <span className={address.isVerified ? 'verified' : 'not-verified'}>
              {address.isVerified ? '✓ Yes' : '✗ No'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="data-viewer-container">
      <div className="data-viewer-header">
        <h1>📊 Database Viewer</h1>
        <button onClick={fetchData} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'hospitals' ? 'active' : ''}`}
          onClick={() => setActiveTab('hospitals')}
        >
          🏥 Hospitals
        </button>
        <button
          className={`tab ${activeTab === 'schemes' ? 'active' : ''}`}
          onClick={() => setActiveTab('schemes')}
        >
          📋 Schemes
        </button>
        <button
          className={`tab ${activeTab === 'validations' ? 'active' : ''}`}
          onClick={() => setActiveTab('validations')}
        >
          ✅ Validations
        </button>
        <button
          className={`tab ${activeTab === 'addresses' ? 'active' : ''}`}
          onClick={() => setActiveTab('addresses')}
        >
          📍 Addresses
        </button>
      </div>

      <div className="data-content">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>❌ Error: {error}</p>
            <button onClick={fetchData}>Try Again</button>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'hospitals' && renderHospitals()}
            {activeTab === 'schemes' && renderSchemes()}
            {activeTab === 'validations' && renderValidations()}
            {activeTab === 'addresses' && renderAddresses()}
          </>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'hospitals' && hospitals.length === 0 && (
              <div className="empty-state">No hospitals found</div>
            )}
            {activeTab === 'schemes' && schemes.length === 0 && (
              <div className="empty-state">No schemes found</div>
            )}
            {activeTab === 'validations' && validations.length === 0 && (
              <div className="empty-state">No validations found</div>
            )}
            {activeTab === 'addresses' && addresses.length === 0 && (
              <div className="empty-state">No addresses found</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DataViewer;
