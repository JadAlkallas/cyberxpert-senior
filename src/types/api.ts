
// Common API response types for Django REST framework
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Error response types
export interface ApiError {
  detail?: string;
  message?: string;
  non_field_errors?: string[];
  [key: string]: any;
}

// JWT token types
export interface TokenResponse {
  access: string;
  refresh: string;
}

// Django user fields mapping
export interface DjangoUser {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  avatar?: string;
  date_joined: string;
}

// API request configuration
export interface ApiRequestConfig extends RequestInit {
  headers?: Record<string, string>;
}

// Status types for various entities
export type AnalysisStatus = 'initiated' | 'queued' | 'running' | 'completed' | 'failed';
export type UserRole = 'admin' | 'developer';
export type UserStatus = 'active' | 'suspended';
