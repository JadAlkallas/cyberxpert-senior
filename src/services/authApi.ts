import { apiRequest } from './api';
import { User, UserRole, UserStatus } from '@/context/AuthContext';

// API request/response types
export interface LoginRequest {
  username: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  status?: UserStatus;
  avatarUrl?: string;
}

// Authentication API service
export const authApi = {
  // User login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // User signup
  signup: async (data: SignupRequest): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // User logout
  logout: async (): Promise<{ success: boolean }> => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    return apiRequest('/auth/profile');
  },

  // Update user profile
  updateProfile: async (data: UpdateUserRequest): Promise<User> => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Admin: Get all users - Updated to match backend method name
  getAllUsers: async (): Promise<User[]> => {
    return apiRequest('/admin/users');
  },

  // Admin: Create user account - Updated to match backend validation
  createUser: async (data: CreateUserRequest): Promise<User> => {
    console.log("=== AUTH API CREATE USER DEBUG ===");
    console.log("Request data:", data);
    console.log("Current auth token:", localStorage.getItem("auth-token"));
    console.log("Making request to: /admin/users");
    
    try {
      const result = await apiRequest<User>('/admin/users', {
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
        if (error.message.includes("403") || error.message.includes("Unauthorized")) {
          console.error("This is an authorization error. The backend is rejecting the request.");
          console.error("Possible causes:");
          console.error("1. Token is invalid or expired");
          console.error("2. User doesn't have admin role on the backend");
          console.error("3. Backend role validation is case-sensitive");
          console.error("4. CSRF token issues");
        }
      }
      
      throw error;
    }
  },

  // Admin: Update user
  updateUser: async (userId: string, data: UpdateUserRequest): Promise<User> => {
    return apiRequest(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Admin: Delete user
  deleteUser: async (userId: string): Promise<{ success: boolean }> => {
    return apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },
};
