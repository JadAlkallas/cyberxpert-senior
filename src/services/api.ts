
// Base API configuration
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// API request helper
const apiRequest = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Get auth token from localStorage if available
  const token = localStorage.getItem('auth-token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    headers: defaultHeaders,
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export { apiRequest, API_BASE_URL };
