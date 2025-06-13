
import { apiRequest } from './api';
import { User, UserRole, UserStatus } from '@/context/AuthContext';
import { TokenResponse, DjangoUser, PaginatedResponse } from '@/types/api';

// API request/response types for Django Simple JWT - Updated for your endpoints
export interface LoginRequest {
  username: string;
  password: string;
}

// Updated to match actual Django response (only tokens, no user data)
export interface LoginResponse extends TokenResponse {
  // No user data in token response
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  password2: string; // Django often requires password confirmation
  role?: UserRole;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
  role: UserRole;
  is_active: boolean; // Django uses is_active instead of status
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  is_active?: boolean;
  avatar?: string;
}

// Authentication API service for Django Simple JWT - Updated to handle token-only response
export const authApi = {
  // User login - Now only expects tokens from /auth/token
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/auth/token', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // User signup
  signup: async (data: SignupRequest): Promise<LoginResponse> => {
    // Add password confirmation for Django
    const signupData = {
      ...data,
      password2: data.password,
    };
    
    return apiRequest<LoginResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });
  },

  // Token refresh - Using your /auth/token/refresh endpoint (no trailing slash)
  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    return apiRequest('/auth/token/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },

  // User logout - Using your /auth/token/invalidate endpoint (no trailing slash)
  logout: async (): Promise<{ detail: string }> => {
    const refreshToken = localStorage.getItem('refresh-token');
    if (refreshToken) {
      return apiRequest('/auth/token/invalidate', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
      });
    }
    return { detail: 'Logged out successfully' };
  },

  // Get current user profile
  getProfile: async (): Promise<DjangoUser> => {
    return apiRequest('/auth/user/');
  },

  // Update user profile
  updateProfile: async (data: UpdateUserRequest): Promise<DjangoUser> => {
    return apiRequest('/auth/user/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiRequest<{ avatar_url: string }>('/auth/upload-avatar/', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type - let browser set it for FormData
      } as Record<string, string>,
    }).then(response => response.avatar_url);
  },

  // Admin: Get all users
  getAllUsers: async (): Promise<DjangoUser[]> => {
    const response = await apiRequest<PaginatedResponse<DjangoUser> | DjangoUser[]>('/admin/users/');
    // Handle both paginated and non-paginated responses
    return Array.isArray(response) ? response : response.results;
  },

  // Admin: Create user account
  createUser: async (data: CreateUserRequest): Promise<DjangoUser> => {
    console.log("=== AUTH API CREATE USER DEBUG ===");
    console.log("Request data:", data);
    console.log("Current access token:", localStorage.getItem("access-token"));
    console.log("Making request to: /admin/users/");
    
    try {
      const result = await apiRequest<DjangoUser>('/admin/users/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      console.log("Create user API response:", result);
      return result;
    } catch (error) {
      console.error("Create user API error:", error);
      
      // Log additional details about the error
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        if (error.message.includes("403") || error.message.includes("Forbidden")) {
          console.error("This is an authorization error. The Django backend is rejecting the request.");
          console.error("Possible causes:");
          console.error("1. JWT token is invalid or expired");
          console.error("2. User doesn't have admin permissions on the backend");
          console.error("3. Django permissions are not properly configured");
        }
      }
      
      throw error;
    }
  },

  // Admin: Update user
  updateUser: async (userId: string, data: UpdateUserRequest): Promise<DjangoUser> => {
    return apiRequest(`/admin/users/${userId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Admin: Delete user
  deleteUser: async (userId: string): Promise<{ detail: string }> => {
    return apiRequest(`/admin/users/${userId}/`, {
      method: 'DELETE',
    });
  },
};
