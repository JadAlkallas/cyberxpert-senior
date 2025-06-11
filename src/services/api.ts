
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
    
    await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    csrfInitialized = true;
    console.log('CSRF initialized successfully');
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
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please ensure your Laravel backend is running on http://localhost:8000 and CORS is properly configured.');
    }
    
    throw error;
  }
};

export { apiRequest, API_BASE_URL };
