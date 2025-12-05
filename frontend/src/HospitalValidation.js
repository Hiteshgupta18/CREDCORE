import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import './style.css';
import { HospitalValidationService } from './services/hospitalValidationService';
import HospitalMap from './components/HospitalMap';

export default function HospitalValidation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedText, setScannedText] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [providers, setProviders] = useState([]);
  const fileInputRef = useRef(null);
  const [mapHospitals, setMapHospitals] = useState([]);
  const [validationResults, setValidationResults] = useState([
    {
      extractedAddress: "12 MG Road, Central",
      matchedAddress: "12 MG Road, Central",
      jaccardScore: 0.92,
      status: "verified"
    },
    {
      extractedAddress: "45 Green St",
      matchedAddress: "45 Green St",
      jaccardScore: 0.67,
      status: "pending"
    }
  ]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    // Load existing providers when component mounts
    const loadProviders = async () => {
      const { success, providers, error } = await HospitalValidationService.getAllProviders();
      if (success) {
        setProviders(providers);
      } else {
        console.error('Error loading providers:', error);
      }
    };
    loadProviders();
  }, []);

  const performOCR = async (file) => {
    setIsProcessing(true);
    setError(null);
    setScanData(null);
    
    try {
      const result = await Tesseract.recognize(
        file,
        'eng',
        { 
          logger: m => {
            if (m.status === 'recognizing text') {
              console.log(`${m.progress * 100}% completed`);
            }
          }
        }
      );
      
      const text = result.data.text;
      const extractedInfo = extractInformation(text);
      
      const scanDataResult = {
        rawText: text,
        parsedInfo: extractedInfo,
        timestamp: new Date().toISOString(),
        fileInfo: {
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          type: file.type
        }
      };
      
      setScanData(scanDataResult);

      // Save to database
      const { success, provider, error: dbError } = await HospitalValidationService.saveOCRResults({
        rawData: text,
        parsedInfo: extractedInfo
      });

      if (!success) {
        throw new Error(dbError || 'Failed to save to database');
      }

      // Update validation results
      const newResult = {
        extractedAddress: extractedInfo.address || 'Address not found',
        matchedAddress: findMatchingAddress(extractedInfo.address),
        jaccardScore: calculateJaccardSimilarity(extractedInfo.address),
        status: calculateJaccardSimilarity(extractedInfo.address) > 0.8 ? "verified" : "pending",
        hospitalName: extractedInfo.hospitalName,
        licenseNumber: extractedInfo.licenseNumber,
        address: extractedInfo.address
      };
      
      setValidationResults(prev => [newResult, ...prev]);
      
      // Add to map hospitals
      setMapHospitals(prev => [
        {
          name: extractedInfo.hospitalName || 'New Hospital',
          address: extractedInfo.address,
          licenseNumber: extractedInfo.licenseNumber,
          jaccardScore: calculateJaccardSimilarity(extractedInfo.address),
          status: calculateJaccardSimilarity(extractedInfo.address) > 0.8 ? "verified" : "pending",
          coordinates: null // Will be geocoded or use default
        },
        ...prev
      ]);

      setScannedText(text);
    } catch (error) {
      console.error('OCR Error:', error);
      setError({
        message: 'Error processing the document',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const extractInformation = (text) => {
    const info = {
      hospitalName: '',
      address: '',
      licenseNumber: '',
      validUntil: ''
    };

    const lines = text.split('\\n');
    if (lines.length > 0) {
      info.hospitalName = lines[0].trim();
    }

    const addressRegex = /(?:address|location|situated at|premises at)[:\s]+([^\\n]+)/i;
    const addressMatch = text.match(addressRegex);
    if (addressMatch) {
      info.address = addressMatch[1].trim();
    }

    const licenseRegex = /(?:license|registration)(?:\\s+no\\.?|\\s+number)[:\s]+([A-Z0-9-]+)/i;
    const licenseMatch = text.match(licenseRegex);
    if (licenseMatch) {
      info.licenseNumber = licenseMatch[1].trim();
    }

    const dateRegex = /(?:valid until|expiry date|valid through)[:\s]+([\\d\\/\\-]+)/i;
    const dateMatch = text.match(dateRegex);
    if (dateMatch) {
      info.validUntil = dateMatch[1].trim();
    }

    return info;
  };

  const calculateJaccardSimilarity = (address) => {
    if (!address) return 0;
    return 0.92; // Placeholder score
  };

  const findMatchingAddress = (address) => {
    if (!address) return 'No address found';
    return address;
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setUploadedImage(URL.createObjectURL(droppedFile));
      await performOCR(droppedFile);
    } else {
      alert('Please drop an image file (PNG, JPG, etc.)');
    }
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setUploadedImage(URL.createObjectURL(selectedFile));
      await performOCR(selectedFile);
    } else {
      alert('Please select an image file (PNG, JPG, etc.)');
    }
  };

  return (
    <section id="validation-page" className="container">
      <h1>Hospital Validation</h1>
      <p className="intro-text">Upload a hospital license or document to extract and validate provider data.</p>

      <div className="validation-layout">
        <div className="validation-panel left-panel">
          <div 
            className="upload-box"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            {isProcessing ? (
              <div className="processing-indicator">
                <div className="spinner"></div>
                <p>Processing document...</p>
              </div>
            ) : uploadedImage ? (
              <div className="preview-container">
                <img src={uploadedImage} alt="Uploaded document" className="document-preview" />
                <button 
                  className="new-scan-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedImage(null);
                    setScannedText('');
                    fileInputRef.current.value = '';
                  }}
                >
                  Scan New Document
                </button>
              </div>
            ) : (
              <>
                <div className="upload-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <p className="drag-text">Drag & drop or click to upload</p>
                <p className="supported-text">Supported: JPG, PNG — License, registration, or address proof</p>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              accept="image/*"
            />
          </div>

          {error && (
            <div className="error-message">
              <h3>Error Processing Document</h3>
              <div className="error-details">
                <p><strong>Message:</strong> {error.message}</p>
                <p><strong>Details:</strong> {error.details}</p>
                <p><strong>Time:</strong> {new Date(error.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}

          {scanData && (
            <div className="ocr-results">
              <h3>Scanned Document Information</h3>
              <div className="scan-metadata">
                <p><strong>File:</strong> {scanData.fileInfo.name} ({scanData.fileInfo.size})</p>
                <p><strong>Scanned at:</strong> {new Date(scanData.timestamp).toLocaleString()}</p>
              </div>
              <div className="parsed-info">
                <h4>Extracted Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Hospital Name:</label>
                    <span>{scanData.parsedInfo.hospitalName || 'Not found'}</span>
                  </div>
                  <div className="info-item">
                    <label>Address:</label>
                    <span>{scanData.parsedInfo.address || 'Not found'}</span>
                  </div>
                  <div className="info-item">
                    <label>License Number:</label>
                    <span>{scanData.parsedInfo.licenseNumber || 'Not found'}</span>
                  </div>
                  <div className="info-item">
                    <label>Valid Until:</label>
                    <span>{scanData.parsedInfo.validUntil || 'Not found'}</span>
                  </div>
                </div>
              </div>
              <div className="raw-text">
                <h4>Raw Scanned Text</h4>
                <div className="info-container">
                  <pre className="scanned-text">{scanData.rawText}</pre>
                </div>
              </div>
            </div>
          )}

          <div className="results-container">
            <h3>Validation Results</h3>
            <table>
              <thead>
                <tr>
                  <th>Provider Name</th>
                  <th>NPI/License</th>
                  <th>Address</th>
                  <th>Trust Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((provider) => {
                  const primaryLocation = provider.locations.find(loc => loc.isPrimary) || provider.locations[0];
                  return (
                    <tr key={provider.id}>
                      <td>{`${provider.firstName} ${provider.lastName}`}</td>
                      <td>{provider.npi}</td>
                      <td>{primaryLocation ? `${primaryLocation.addressLine1}, ${primaryLocation.city}` : 'No address'}</td>
                      <td className="score">{provider.overallTrustScore.toFixed(2)}</td>
                      <td className={`status ${provider.status.toLowerCase()}`}>
                        {provider.status.replace('_', ' ')}
                      </td>
                    </tr>
                  );
                })}
                {validationResults.map((result, index) => (
                  <tr key={`new-${index}`}>
                    <td colSpan="2">New Entry</td>
                    <td>{result.extractedAddress}</td>
                    <td className="score">{result.jaccardScore.toFixed(2)}</td>
                    <td className={`status ${result.status}`}>
                      {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="button-row">
            <button 
              className="add-to-directory-btn"
              onClick={() => {
                alert('Selected entries will be added to the verified directory');
              }}
            >
              Add to Verified Directory
            </button>
          </div>
        </div>

        <div className="validation-panel right-panel">
          <div className="map-view">
            <h2>Map View</h2>
            <div style={{ height: '600px', width: '100%', position: 'relative' }}>
              <HospitalMap 
                hospitals={mapHospitals}
                center={[75.7873, 26.9124]} // Jaipur coordinates
                zoom={12}
              />
            </div>
            <p className="confidence-text">
              Map markers show validated hospitals. 
              <span style={{ color: '#00E676', fontWeight: '600' }}> Green</span> = High confidence (&gt;80%), 
              <span style={{ color: '#00BCD4', fontWeight: '600' }}> Blue</span> = Medium (60-80%), 
              <span style={{ color: '#FFA726', fontWeight: '600' }}> Orange</span> = Low (&lt;60%)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}