
import { ENV } from '@/config/env';

// Base API configuration - Updated to use port 8000 for Django backend
const API_BASE_URL = ENV.API_BASE_URL;

// JWT token refresh helper - Updated to use your /token/refresh endpoint
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refresh-token');
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access-token', data.access);
      return data.access;
    } else {
      // Refresh token is invalid, clear all tokens
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('cyberxpert-user');
      return null;
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
};

// API request helper
const apiRequest = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  console.log('Making API request to:', `${API_BASE_URL}${endpoint}`);
  console.log('Request payload:', options?.body);
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Get JWT access token from localStorage if available
  let accessToken = localStorage.getItem('access-token');
  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`; // JWT format
  }

  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  try {
    console.log('Fetch config:', { url, method: config.method || 'GET', headers: config.headers });
    
    let response = await fetch(url, config);
    
    // If we get a 401 and have a refresh token, try to refresh
    if (response.status === 401 && accessToken) {
      console.log('Access token expired, trying to refresh...');
      const newAccessToken = await refreshAccessToken();
      
      if (newAccessToken) {
        // Retry the request with new token
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${newAccessToken}`,
        };
        response = await fetch(url, config);
      } else {
        // Refresh failed, redirect to login would be handled by the calling code
        throw new Error('Authentication failed. Please log in again.');
      }
    }
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        console.error('API Error response:', errorData);
        
        // Handle Django REST framework error format
        if (response.status === 400 && errorData.detail) {
          errorMessage = errorData.detail;
        } else if (response.status === 400 && errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors.join(', ');
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    
    // Provide more specific error messages based on error type
    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error(`Cannot connect to Django server at ${API_BASE_URL}. Please ensure:\n• Your Django backend is running on port 8000\n• CORS is properly configured in your Django settings\n• No firewall is blocking the connection\n• The backend routes are properly set up`);
      }
    }
    
    // If it's already a formatted error, re-throw it
    if (error instanceof Error) {
      throw error;
    }
    
    // Fallback for unknown errors
    throw new Error('An unexpected error occurred while connecting to the Django server');
  }
};

export { apiRequest, API_BASE_URL };
