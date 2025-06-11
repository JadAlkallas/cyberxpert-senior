
import { ENV } from '@/config/env';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ENV.API_BASE_URL;

// Initialize CSRF token
let csrfInitialized = false;

const initializeCsrf = async (): Promise<void> => {
  if (csrfInitialized) return;
  
  try {
    // Laravel Sanctum requires getting CSRF cookie first
    const baseUrl = API_BASE_URL.replace('/api', '');
    console.log('Initializing CSRF from:', `${baseUrl}/sanctum/csrf-cookie`);
    
    const csrfResponse = await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    
    console.log('CSRF Response status:', csrfResponse.status);
    console.log('CSRF Response headers:', Object.fromEntries(csrfResponse.headers.entries()));
    
    if (csrfResponse.ok) {
      csrfInitialized = true;
      console.log('CSRF initialized successfully');
    } else {
      console.warn('CSRF initialization failed with status:', csrfResponse.status);
    }
  } catch (error) {
    console.error('Failed to initialize CSRF:', error);
    // Don't throw error, let the auth request proceed
  }
};

// API request helper
const apiRequest = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  console.log('Making API request to:', `${API_BASE_URL}${endpoint}`);
  
  // Initialize CSRF for authentication endpoints
  if (endpoint.includes('/auth/') && !csrfInitialized) {
    await initializeCsrf();
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  // Get auth token from localStorage if available
  const token = localStorage.getItem('auth-token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    credentials: 'include', // Important for Laravel Sanctum
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
        errorMessage = errorData.message || errorMessage;
        console.error('API Error response:', errorData);
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
        throw new Error('Cannot connect to server. Please ensure:\n• Your Laravel backend is running on http://localhost:8000\n• CORS is properly configured in your Laravel app\n• No firewall is blocking the connection\n• The backend routes are properly set up');
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
