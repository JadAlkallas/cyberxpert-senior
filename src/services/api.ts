
import { ENV } from '@/config/env';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ENV.API_BASE_URL;

// Initialize CSRF token
let csrfInitialized = false;

const initializeCsrf = async (): Promise<void> => {
  if (csrfInitialized) return;
  
  try {
    // Laravel Sanctum requires getting CSRF cookie first
    await fetch(`${API_BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
    });
    csrfInitialized = true;
  } catch (error) {
    console.error('Failed to initialize CSRF:', error);
  }
};

// API request helper
const apiRequest = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
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
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export { apiRequest, API_BASE_URL };
