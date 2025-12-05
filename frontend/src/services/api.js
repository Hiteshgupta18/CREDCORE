import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const AddressValidationService = {
  // Compare a single address
  async compareAddress(inputAddress) {
    try {
      const response = await api.post('/addresses/compare', { inputAddress });
      return response.data;
    } catch (error) {
      console.error('Error comparing address:', error);
      throw error;
    }
  },

  // Validate multiple addresses
  async validateAddresses(addresses) {
    try {
      const response = await api.post('/addresses/validate', { addresses });
      return response.data;
    } catch (error) {
      console.error('Error validating addresses:', error);
      throw error;
    }
  },

  // Test API connection
  async testConnection() {
    try {
      // Hit the health endpoint (not under /api)
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const healthURL = baseURL.replace('/api', '/health');
      const response = await axios.get(healthURL, { timeout: 5000 });
      return response.data;
    } catch (error) {
      console.error('API Connection Error:', error);
      throw error;
    }
  }
};

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // No response received
      console.error('No response received:', error.request);
    } else {
      // Error in request setup
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);