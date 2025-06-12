
import { ENV } from '@/config/env';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ENV.API_BASE_URL;

// Initialize CSRF token for Django
let csrfToken: string | null = null;

const getCsrfToken = async (): Promise<string | null> => {
  if (csrfToken) return csrfToken;
  
  try {
    console.log('Getting CSRF token from Django');
    const response = await fetch(`${API_BASE_URL}/auth/csrf/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      csrfToken = data.csrfToken;
      console.log('CSRF token obtained successfully');
      return csrfToken;
    }
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
  }
  
  return null;
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

  // Get auth token from localStorage if available
  const token = localStorage.getItem('auth-token');
  if (token) {
    defaultHeaders['Authorization'] = `Token ${token}`; // Django REST framework token format
  }

  // Get CSRF token for state-changing requests
  if (options?.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
    const csrf = await getCsrfToken();
    if (csrf) {
      defaultHeaders['X-CSRFToken'] = csrf;
    }
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
    
    const response = await fetch(url, config);
    
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
        throw new Error('Cannot connect to server. Please ensure:\n• Your Django backend is running\n• CORS is properly configured in your Django settings\n• No firewall is blocking the connection\n• The backend routes are properly set up');
      }
    }
    
    // If it's already a formatted error, re-throw it
    if (error instanceof Error) {
      throw error;
    }
    
    // Fallback for unknown errors
    throw new Error('An unexpected error occurred while connecting to the server');
  }
};

export { apiRequest, API_BASE_URL };
