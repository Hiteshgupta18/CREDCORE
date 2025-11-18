import React, { useState } from 'react';
import './style.css';
import HospitalMap from './components/HospitalMap';

function Directory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    district: 'all',
    type: 'all',
    governmentOnly: false
  });

  const [hospitals] = useState([
    {
      id: 1,
      name: "City General Hospital",
      status: "verified",
      address: "12 MG Road, Central",
      schemes: ["Ayushman Bharat"],
      type: "government",
      district: "central",
      coordinates: [75.7873, 26.9124], // Jaipur center
      jaccardScore: 0.95
    },
    {
      id: 2,
      name: "Sunrise Private Clinic",
      status: "pending",
      address: "45 Green St",
      schemes: [],
      type: "private",
      district: "east",
      coordinates: [75.8200, 26.9200],
      jaccardScore: 0.65
    },
    {
      id: 3,
      name: "Apex Medical Centre",
      status: "verified",
      address: "88 River Lane",
      schemes: ["CGHS", "Ayushman Bharat"],
      type: "private",
      district: "west",
      coordinates: [75.7600, 26.9050],
      jaccardScore: 0.88
    },
    {
      id: 4,
      name: "Metro Healthcare Hub",
      status: "verified",
      address: "156 Station Road",
      schemes: ["CGHS", "ECHS"],
      type: "private",
      district: "central",
      coordinates: [75.8000, 26.9300],
      jaccardScore: 0.92
    },
    {
      id: 5,
      name: "District Hospital",
      status: "verified",
      address: "34 Government Complex",
      schemes: ["Ayushman Bharat", "CGHS", "ECHS"],
      type: "government",
      district: "east",
      coordinates: [75.8400, 26.9000],
      jaccardScore: 0.97
    }
  ]);

  // Filter hospitals based on search and filters
  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = filters.district === 'all' || hospital.district === filters.district;
    const matchesType = filters.type === 'all' || hospital.type === filters.type;
    const matchesGovernment = !filters.governmentOnly || hospital.type === 'government';

    return matchesSearch && matchesDistrict && matchesType && matchesGovernment;
  });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section id="directory-page" className="container">
      <h1>Verified Hospital Directory</h1>
      <p className="intro-text">Find verified hospitals and the schemes they support.</p>

      <div className="filter-bar">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search hospitals"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select 
            name="district" 
            value={filters.district}
            onChange={(e) => handleFilterChange('district', e.target.value)}
          >
            <option value="all">All Districts</option>
            <option value="central">Central</option>
            <option value="east">East</option>
            <option value="west">West</option>
          </select>
        </div>

        <div className="filter-group">
          <select 
            name="type" 
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="private">Private</option>
            <option value="government">Government</option>
          </select>
        </div>

        <div className="filter-group checkbox-group">
          <input 
            type="checkbox" 
            id="gov-only" 
            checked={filters.governmentOnly}
            onChange={(e) => handleFilterChange('governmentOnly', e.target.checked)}
          />
          <label htmlFor="gov-only">Government Only</label>
        </div>
      </div>

      <div className="directory-layout">
        <div className="hospital-list">
          {filteredHospitals.map(hospital => (
            <div key={hospital.id} className={`hospital-card ${hospital.status}`}>
              <div className="card-header">
                <h3>{hospital.name}</h3>
                {hospital.status === "verified" ? (
                  <div className="status-icon verified">✓</div>
                ) : (
                  <div className="status-tag pending">Pending</div>
                )}
              </div>
              <p className="address">{hospital.address}</p>
              <p className="schemes">
                {hospital.schemes.length > 0 
                  ? hospital.schemes.join(' • ') 
                  : 'No listed schemes'}
              </p>
              <div className="hospital-type-tag">
                {hospital.type === 'government' ? 'Government' : 'Private'}
              </div>
            </div>
          ))}
        </div>

        <div className="directory-map">
          <h2>Hospital Locations</h2>
          <div style={{ height: '600px', width: '100%', position: 'relative' }}>
            <HospitalMap 
              hospitals={filteredHospitals}
              center={[75.7873, 26.9124]}
              zoom={12}
            />
          </div>
          <div className="map-legend" style={{ marginTop: '15px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#333' }}>Map Legend:</p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '14px' }}>
              <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#00E676', marginRight: '6px' }}></span>High Confidence (&gt;80%)</span>
              <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#00BCD4', marginRight: '6px' }}></span>Medium Confidence (60-80%)</span>
              <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#FFA726', marginRight: '6px' }}></span>Low Confidence (&lt;60%)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Directory;