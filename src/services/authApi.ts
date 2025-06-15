
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
  username: string; // Added username field
  first_name: string;
  last_name: string;
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

// Authentication API service for Django Simple JWT - Updated to match your actual endpoints
export const authApi = {
  // User login - POST /api/auth/token
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/auth/token', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // User signup - Using create developer endpoint
  signup: async (data: SignupRequest): Promise<LoginResponse> => {
    // Add password confirmation for Django
    const signupData = {
      ...data,
      password2: data.password,
    };
    
    return apiRequest<LoginResponse>('/admin/create/developer', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });
  },

  // Token refresh - POST /api/auth/token/refresh
  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    return apiRequest('/auth/token/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },

  // User logout - POST /api/auth/token/invalidate
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

  // Get current user profile - GET /api/developer/profile
  getProfile: async (): Promise<DjangoUser> => {
    return apiRequest('/developer/profile');
  },

  // Update user profile - PATCH /api/developer/profile/update
  updateProfile: async (data: UpdateUserRequest): Promise<DjangoUser> => {
    return apiRequest('/developer/profile/update', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Upload avatar - Uses appropriate endpoint based on user role
  uploadAvatar: async (file: File, userRole: UserRole): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    // Use different endpoints based on user role
    const endpoint = userRole === 'admin' ? '/admin/profile/update' : '/developer/profile/update';
    
    const response = await apiRequest<DjangoUser>(endpoint, {
      method: 'PATCH',
      body: formData,
      headers: {
        // Don't set Content-Type - let browser set it for FormData
      } as Record<string, string>,
    });
    
    // Return the avatar URL from the response
    return response.avatar || '';
  },

  // Admin: Get all users - combining developers and admins
  getAllUsers: async (): Promise<DjangoUser[]> => {
    try {
      // Get both developers and admins
      const [developers, admins] = await Promise.all([
        apiRequest<PaginatedResponse<DjangoUser> | DjangoUser[]>('/admin/get/developers'),
        apiRequest<PaginatedResponse<DjangoUser> | DjangoUser[]>('/admin/get/admins')
      ]);
      
      // Handle both paginated and non-paginated responses
      const devList = Array.isArray(developers) ? developers : developers.results;
      const adminList = Array.isArray(admins) ? admins : admins.results;
      
      return [...devList, ...adminList];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  // Admin: Create user account - POST /api/admin/create/developer or /api/admin/create/admin
  createUser: async (data: CreateUserRequest): Promise<DjangoUser> => {
    console.log("=== AUTH API CREATE USER DEBUG ===");
    console.log("Request data:", data);
    console.log("Current access token:", localStorage.getItem("access-token"));
    
    const endpoint = data.role === 'admin' ? '/admin/create/admin' : '/admin/create/developer';
    console.log("Making request to:", endpoint);
    
    try {
      const result = await apiRequest<DjangoUser>(endpoint, {
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

  // Admin: Update user - PATCH /api/admin/update/developer/{id} or /api/admin/update/admin/{id}
  updateUser: async (userId: string, data: UpdateUserRequest & { role?: UserRole }): Promise<DjangoUser> => {
    const endpoint = data.role === 'admin' ? `/admin/update/admin/${userId}` : `/admin/update/developer/${userId}`;
    return apiRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Admin: Delete user - DELETE /api/admin/delete/developer/{id} or /api/admin/delete/admin/{id}
  deleteUser: async (userId: string, role: UserRole): Promise<{ detail: string }> => {
    const endpoint = role === 'admin' ? `/admin/delete/admin/${userId}` : `/admin/delete/developer/${userId}`;
    return apiRequest(endpoint, {
      method: 'DELETE',
    });
  },

  // Admin: Activate user - PATCH /api/admin/update/developer/{id}/activate or /api/admin/update/admin/{id}/activate
  activateUser: async (userId: string, role: UserRole): Promise<DjangoUser> => {
    const endpoint = role === 'admin' ? `/admin/update/admin/${userId}/activate` : `/admin/update/developer/${userId}/activate`;
    return apiRequest(endpoint, {
      method: 'PATCH',
    });
  },

  // Admin: Deactivate user - PATCH /api/admin/update/developer/{id}/deactivate or /api/admin/update/admin/{id}/deactivate
  deactivateUser: async (userId: string, role: UserRole): Promise<DjangoUser> => {
    const endpoint = role === 'admin' ? `/admin/update/admin/${userId}/deactivate` : `/admin/update/developer/${userId}/deactivate`;
    return apiRequest(endpoint, {
      method: 'PATCH',
    });
  },

  // Admin: Update password - PATCH /api/admin/update/developer/{id}/password or /api/admin/update/admin/{id}/password
  updateUserPassword: async (userId: string, role: UserRole, password: string): Promise<DjangoUser> => {
    const endpoint = role === 'admin' ? `/admin/update/admin/${userId}/password` : `/admin/update/developer/${userId}/password`;
    return apiRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ password }),
    });
  },

  // Developer: Change password - PATCH /api/developer/change-password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ detail: string }> => {
    return apiRequest('/developer/change-password', {
      method: 'PATCH',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  },
};
