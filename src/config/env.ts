
// Environment configuration for Django backend integration
export const ENV = {
  // Django backend API base URL - Updated for port 8000
  API_BASE_URL: 'http://localhost:8000/api',
  
  // App configuration
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Development settings
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  
  // Production settings
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
};
