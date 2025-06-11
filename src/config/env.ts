
// Environment configuration
export const ENV = {
  // API Configuration - Update this to your Laravel backend URL
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  
  // Development flags
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  
  // Feature flags
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true', // Enable mock data if backend is not available
  
  // App configuration
  APP_NAME: 'CyberXpert',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const;

// Type-safe environment variable access
export const getEnvVar = (key: keyof typeof ENV): string => {
  const value = ENV[key];
  if (typeof value !== 'string') {
    throw new Error(`Environment variable ${key} is not defined or not a string`);
  }
  return value;
};
