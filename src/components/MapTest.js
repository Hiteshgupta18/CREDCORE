import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapTest = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    // Debug token
    const token = process.env.REACT_APP_MAPBOX_TOKEN;
    console.log('=== MAPBOX DEBUG INFO ===');
    console.log('Token exists:', !!token);
    console.log('Token length:', token?.length);
    console.log('Token starts with pk.:', token?.startsWith('pk.'));
    console.log('Full token:', token);
    console.log('========================');

    if (!token) {
      console.error('❌ REACT_APP_MAPBOX_TOKEN is not defined');
      return;
    }

    mapboxgl.accessToken = token;

    if (map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [75.7873, 26.9124], // Jaipur
        zoom: 12
      });

      map.current.on('load', () => {
        console.log('✅ Map loaded successfully!');
        
        // Add a test marker
        new mapboxgl.Marker({ color: '#00E676' })
          .setLngLat([75.7873, 26.9124])
          .setPopup(new mapboxgl.Popup().setHTML('<h3>Test Hospital</h3><p>Jaipur, Rajasthan</p>'))
          .addTo(map.current);
      });

      map.current.on('error', (e) => {
        console.error('❌ Map error:', e.error);
      });

    } catch (error) {
      console.error('❌ Failed to initialize map:', error);
    }

    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mapbox Test Page</h2>
      <p>Check the console for debug information</p>
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '500px',
          border: '2px solid #ccc',
          borderRadius: '8px',
          marginTop: '20px'
        }} 
      />
    </div>
  );
};

export default MapTest;
