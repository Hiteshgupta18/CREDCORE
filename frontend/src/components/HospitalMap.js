import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
console.log('Mapbox Token:', MAPBOX_TOKEN ? 'Token loaded ✓' : 'Token missing ✗');
console.log('Token length:', MAPBOX_TOKEN?.length);

if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes('placeholder')) {
  console.error('⚠️ Invalid Mapbox token. Please set REACT_APP_MAPBOX_TOKEN in .env file');
}

mapboxgl.accessToken = MAPBOX_TOKEN || '';

const HospitalMap = ({ hospitals = [], center = [75.7873, 26.9124], zoom = 12 }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    if (!MAPBOX_TOKEN) {
      console.error('⚠️ No Mapbox token found');
      setMapError('Mapbox token is missing. Please add REACT_APP_MAPBOX_TOKEN to your .env file.');
      return;
    }

    if (!mapContainer.current) {
      console.error('⚠️ Map container not ready');
      return;
    }

    try {
      console.log('🗺️ Initializing Mapbox map...');
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
        attributionControl: true
      });

      console.log('✓ Map object created');

      // Set a timeout to catch cases where load event doesn't fire
      const loadTimeout = setTimeout(() => {
        console.log('⏱️ Map load timeout - marking as ready');
        setMapLoaded(true);
      }, 3000);

      map.current.on('load', () => {
        console.log('✅ Map loaded successfully!');
        clearTimeout(loadTimeout);
        setMapLoaded(true);
        
        // Add navigation controls after load
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
      });

      map.current.on('error', (e) => {
        console.error('❌ Map error:', e);
        clearTimeout(loadTimeout);
        setMapError(`Map error: ${e.error?.message || e.message || 'Unknown error'}`);
      });

      // Cleanup on unmount
      return () => {
        clearTimeout(loadTimeout);
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('❌ Error initializing map:', error);
      setMapError(error.message || 'Failed to initialize map');
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !map.current) {
      console.log('⏳ Waiting for map to load...');
      return;
    }

    console.log(`📍 Adding ${hospitals.length} markers to map`);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each hospital
    hospitals.forEach((hospital) => {
      // Use hospital coordinates or default to Jaipur with slight offset
      const coordinates = hospital.coordinates || [
        center[0] + (Math.random() - 0.5) * 0.1,
        center[1] + (Math.random() - 0.5) * 0.1
      ];

      // Create marker color based on status or confidence
      let markerColor = '#00BCD4'; // Default teal
      if (hospital.status === 'verified' || hospital.jaccardScore > 0.8) {
        markerColor = '#00E676'; // Green for verified/high confidence
      } else if (hospital.jaccardScore < 0.6) {
        markerColor = '#FFA726'; // Orange for low confidence
      }

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundColor = markerColor;
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';

      // Create popup content
      const popupContent = `
        <div style="padding: 10px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #0A3C6E; font-size: 16px;">
            ${hospital.name || hospital.hospitalName || 'Hospital'}
          </h3>
          ${hospital.address ? `
            <p style="margin: 5px 0; font-size: 13px; color: #666;">
              <strong>Address:</strong> ${hospital.address}
            </p>
          ` : ''}
          ${hospital.licenseNumber ? `
            <p style="margin: 5px 0; font-size: 13px; color: #666;">
              <strong>License:</strong> ${hospital.licenseNumber}
            </p>
          ` : ''}
          ${hospital.jaccardScore !== undefined ? `
            <p style="margin: 5px 0; font-size: 13px;">
              <strong>Confidence:</strong> 
              <span style="color: ${hospital.jaccardScore > 0.8 ? '#00E676' : hospital.jaccardScore > 0.6 ? '#00BCD4' : '#FFA726'};">
                ${(hospital.jaccardScore * 100).toFixed(0)}%
              </span>
            </p>
          ` : ''}
          ${hospital.status ? `
            <p style="margin: 5px 0;">
              <span style="padding: 3px 8px; background: ${hospital.status === 'verified' ? '#E8F5E9' : '#FFF3E0'}; 
                     color: ${hospital.status === 'verified' ? '#2E7D32' : '#F57C00'}; 
                     border-radius: 4px; font-size: 12px; font-weight: 600;">
                ${hospital.status.toUpperCase()}
              </span>
            </p>
          ` : ''}
        </div>
      `;

      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px'
      }).setHTML(popupContent);

      // Create and add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map.current);
      
      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are multiple hospitals
    if (hospitals.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      hospitals.forEach(hospital => {
        const coords = hospital.coordinates || [
          center[0] + (Math.random() - 0.5) * 0.1,
          center[1] + (Math.random() - 0.5) * 0.1
        ];
        bounds.extend(coords);
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    }
    
    console.log('✅ Markers added successfully');
  }, [hospitals, mapLoaded]);

  if (mapError) {
    return (
      <div style={{
        width: '100%',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        border: '2px dashed #ddd',
        padding: '40px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h3 style={{ color: '#d32f2f', marginBottom: '10px' }}>❌ Map Error</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>{mapError}</p>
          <div style={{ 
            backgroundColor: '#fff3cd', 
            padding: '15px', 
            borderRadius: '8px',
            fontSize: '14px',
            textAlign: 'left',
            color: '#856404'
          }}>
            <strong>Steps to fix:</strong>
            <ol style={{ marginTop: '10px', marginLeft: '20px' }}>
              <li>Go to <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" style={{color: '#0066cc'}}>https://account.mapbox.com/</a></li>
              <li>Create a free account or sign in</li>
              <li>Copy your access token</li>
              <li>Add it to your <code>.env</code> file: <code>REACT_APP_MAPBOX_TOKEN=your_token</code></li>
              <li>Restart the React development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', position: 'relative' }}>
      {!mapLoaded && !mapError && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            border: '3px solid #00BCD4',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            margin: '0 auto 10px',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Loading map...</p>
        </div>
      )}
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: '500px',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'absolute',
          top: 0,
          left: 0
        }} 
      />
    </div>
  );
};

export default HospitalMap;
