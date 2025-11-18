import React, { useState, useEffect, useRef } from "react";
import { AddressValidationService } from "../services/api";

export default function JaccardTest() {
  const [inputAddress, setInputAddress] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Test API connection on component mount
  const [connectionStatus, setConnectionStatus] = useState({ 
    connected: false, 
    error: null,
    checking: true 
  });

  useEffect(() => {
    const testConnection = async () => {
      try {
        setConnectionStatus({ connected: false, error: null, checking: true });
        await AddressValidationService.testConnection();
        setConnectionStatus({ connected: true, error: null, checking: false });
        console.log('✅ Successfully connected to backend');
      } catch (error) {
        let errorMessage = 'Cannot connect to backend server';
        
        if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          errorMessage = 'Backend server is not running. Please start the server with: cd backend && node server.js';
        } else if (error.response?.status === 404) {
          errorMessage = 'Backend API endpoint not found. Please check the server routes.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        setConnectionStatus({ connected: false, error: errorMessage, checking: false });
        console.error('❌ Failed to connect to backend:', error);
      }
    };
    testConnection();
  }, []);

  const checkAddress = async () => {
    if (!connectionStatus.connected) {
      alert("Backend server is not connected. Please start the server first.");
      return;
    }

    try {
      setLoading(true);
      setResults(null);
      const data = await AddressValidationService.compareAddress(inputAddress);
      setResults(data.matches);
    } catch (error) {
      console.error("Error comparing addresses:", error);
      let errorMsg = "Error comparing addresses. ";
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        errorMsg += "Backend server connection lost. Please restart the server.";
        setConnectionStatus({ connected: false, error: errorMsg, checking: false });
      } else if (error.response?.data?.message) {
        errorMsg += error.response.data.message;
      } else {
        errorMsg += "Please try again.";
      }
      
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Address Validation Test</h2>
      
      {connectionStatus.checking && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">⏳ Checking backend connection...</span>
        </div>
      )}
      
      {!connectionStatus.checking && !connectionStatus.connected && connectionStatus.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">❌ Connection Error</strong>
          <p className="mt-2">{connectionStatus.error}</p>
          <div className="mt-3 p-3 bg-red-50 rounded text-sm">
            <p className="font-semibold mb-2">To fix this:</p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Open a new terminal</li>
              <li>Navigate to backend: <code className="bg-white px-2 py-1 rounded">cd backend</code></li>
              <li>Start the server: <code className="bg-white px-2 py-1 rounded">node server.js</code></li>
              <li>Server should run on <code className="bg-white px-2 py-1 rounded">http://localhost:5000</code></li>
            </ol>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
          >
            Retry Connection
          </button>
        </div>
      )}
      
      {connectionStatus.connected && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">✅ Connected to backend server</span>
        </div>
      )}

      <div className="mb-6">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors mb-4"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewImage ? (
            <div className="relative">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="max-h-48 mx-auto rounded"
              />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-1 text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 10MB</p>
            </>
          )}
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  if (e.target && e.target.result) {
                    setPreviewImage(e.target.result);
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        <div className="mb-4">
          <textarea
            className="w-full p-2 border rounded-lg"
            rows="3"
            placeholder="Enter address to validate..."
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />
        </div>
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        onClick={checkAddress}
        disabled={loading || (!inputAddress.trim() && !previewImage)}
      >
        {loading ? "Comparing..." : "Compare Address"}
      </button>

      {results && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Top Matches:</h3>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  result.score >= 0.6
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <p className="font-medium mb-2">Match Score: {(result.score * 100).toFixed(2)}%</p>
                <p className="text-sm text-gray-600">{result.masterAddress}</p>
                {result.isMatch && (
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    Valid Match
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}