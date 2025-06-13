import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/services/authApi";
import { useApi } from "@/hooks/useApi";

// Updated to match Django backend validation
export type UserRole = "admin" | "developer";
export type UserStatus = "active" | "suspended";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  is_active: boolean; // Django field
  avatarUrl?: string;
  avatar?: string; // Django field name
  createdAt: string;
  date_joined?: string; // Django field name
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  allUsers: User[];
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<string | null>;
  addDevAccount: (username: string, email: string, password: string, role: UserRole, status: UserStatus) => Promise<boolean>;
  deleteDevAccount: (userId: string) => Promise<boolean>;
  updateDevStatus: (userId: string, status: UserStatus) => Promise<boolean>;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper function to normalize Django user data
const normalizeUser = (djangoUser: any): User => {
  return {
    id: djangoUser.id,
    username: djangoUser.username,
    email: djangoUser.email,
    role: djangoUser.role || 'developer',
    status: djangoUser.is_active ? 'active' : 'suspended',
    is_active: djangoUser.is_active,
    avatarUrl: djangoUser.avatar || djangoUser.avatarUrl,
    avatar: djangoUser.avatar,
    createdAt: djangoUser.date_joined || djangoUser.createdAt,
    date_joined: djangoUser.date_joined,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("cyberxpert-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // API hooks
  const loginApi = useApi(authApi.login);
  const signupApi = useApi(authApi.signup);
  const logoutApi = useApi(authApi.logout);
  const updateProfileApi = useApi(authApi.updateProfile, {
    showSuccessToast: true,
    successMessage: "Profile updated successfully"
  });
  const getAllUsersApi = useApi(authApi.getAllUsers);
  const createUserApi = useApi(authApi.createUser, {
    showSuccessToast: true
  });
  const updateUserApi = useApi(authApi.updateUser, {
    showSuccessToast: true
  });
  const deleteUserApi = useApi(authApi.deleteUser, {
    showSuccessToast: true
  });
  const uploadAvatarApi = useApi(authApi.uploadAvatar, {
    showSuccessToast: true,
    successMessage: "Avatar uploaded successfully"
  });

  // Helper function to check if user is admin - handles case sensitivity
  const isUserAdmin = (userRole: string) => {
    return userRole?.toLowerCase() === "admin";
  };

  const isAuthenticated = !!localStorage.getItem('access-token');
  
  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    if (accessToken && !user) {
      // Try to get user profile with existing JWT token (fallback for existing sessions)
      authApi.getProfile()
        .then(userData => {
          const normalizedUser = normalizeUser(userData);
          setUser(normalizedUser);
          localStorage.setItem("cyberxpert-user", JSON.stringify(normalizedUser));
        })
        .catch(() => {
          // Token is invalid, clear all tokens
          localStorage.removeItem('access-token');
          localStorage.removeItem('refresh-token');
          localStorage.removeItem('cyberxpert-user');
        });
    }
  }, []);

  // Load all users for admin
  useEffect(() => {
    if (user?.role === 'admin') {
      refreshUsers();
    }
  }, [user]);

  // Refresh users list (admin only)
  const refreshUsers = async (): Promise<void> => {
    if (!isUserAdmin(user?.role || '')) return;
    
    const users = await getAllUsersApi.execute();
    if (users) {
      const normalizedUsers = users.map(normalizeUser);
      setAllUsers(normalizedUsers);
    }
  };

  // Login function - Now only handles tokens without user data
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log("AuthContext: Starting login for username:", username);
      
      // Get tokens from login endpoint (no user data expected)
      const result = await loginApi.execute({ username, password });
      console.log("AuthContext: Login API result:", result);
      
      if (result && result.access && result.refresh) {
        // Store tokens
        localStorage.setItem("access-token", result.access);
        localStorage.setItem("refresh-token", result.refresh);
        
        console.log("AuthContext: Tokens stored successfully");
        
        toast.success(`Welcome back, ${username}!`);
        
        console.log("AuthContext: Login successful");
        setIsLoading(false);
        return true;
      }
      
      console.log("AuthContext: Login failed - incomplete response");
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Signup function - Updated to handle token-only response
  const signup = async (username: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const result = await signupApi.execute({ username, email, password, password2: password, role });
      
      if (result && result.access && result.refresh) {
        // Store tokens
        localStorage.setItem("access-token", result.access);
        localStorage.setItem("refresh-token", result.refresh);
        
        toast.success("Account created successfully!");
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Signup error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutApi.execute();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setAllUsers([]);
      localStorage.removeItem("cyberxpert-user");
      localStorage.removeItem("access-token");
      localStorage.removeItem("refresh-token");
      navigate("/login");
      toast.success("Logged out successfully");
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    // Convert to Django format
    const djangoUpdates = {
      username: updates.username,
      email: updates.email,
      is_active: updates.status === 'active',
      avatar: updates.avatarUrl,
    };
    
    const result = await updateProfileApi.execute(djangoUpdates);
    
    if (result) {
      const normalizedUser = normalizeUser(result);
      setUser(normalizedUser);
      localStorage.setItem("cyberxpert-user", JSON.stringify(normalizedUser));
      
      // Also update the user in the allUsers list if it exists
      setAllUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, ...normalizedUser } : u
      ));
      
      return true;
    }
    
    return false;
  };

  // New avatar upload function
  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    const result = await uploadAvatarApi.execute(file);
    
    if (result) {
      // Update user profile with new avatar URL
      const updatedUser = { ...user, avatarUrl: result, avatar: result };
      setUser(updatedUser);
      localStorage.setItem("cyberxpert-user", JSON.stringify(updatedUser));
      
      // Also update in allUsers list
      setAllUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, avatarUrl: result, avatar: result } : u
      ));
      
      return result;
    }
    
    return null;
  };
  
  const addDevAccount = async (
    username: string, 
    email: string, 
    password: string, 
    role: UserRole,
    status: UserStatus
  ): Promise<boolean> => {
    console.log("=== ADD DEV ACCOUNT DEBUG INFO ===");
    console.log("Current user:", user);
    console.log("Current user role:", user?.role);
    console.log("Is current user admin?", isUserAdmin(user?.role || ''));
    console.log("Access token exists:", !!localStorage.getItem("access-token"));
    
    if (!user || !isUserAdmin(user.role)) {
      toast.error("Access denied: Admin privileges required");
      return false;
    }
    
    const result = await createUserApi.execute({
      username,
      email,
      password,
      password2: password,
      role,
      is_active: status === 'active'
    });
    
    if (result) {
      const normalizedUser = normalizeUser(result);
      setAllUsers(prev => [...prev, normalizedUser]);
      return true;
    }
    
    return false;
  };
  
  const deleteDevAccount = async (userId: string): Promise<boolean> => {
    const result = await deleteUserApi.execute(userId);
    
    if (result) {
      const userToDelete = allUsers.find(u => u.id === userId);
      setAllUsers(prev => prev.filter(u => u.id !== userId));
      
      if (userToDelete) {
        toast.success(`Deleted user: ${userToDelete.username}`);
      }
      
      return true;
    }
    
    return false;
  };
  
  const updateDevStatus = async (userId: string, status: UserStatus): Promise<boolean> => {
    const result = await updateUserApi.execute(userId, { is_active: status === 'active' });
    
    if (result) {
      const normalizedUser = normalizeUser(result);
      setAllUsers(prev => prev.map(u => 
        u.id === userId ? normalizedUser : u
      ));
      
      toast.success(`Updated ${normalizedUser.username}'s status to ${status}`);
      
      // If the currently logged in user is being updated, update their session too
      if (user && user.id === userId) {
        setUser(normalizedUser);
        localStorage.setItem("cyberxpert-user", JSON.stringify(normalizedUser));
      }
      
      return true;
    }
    
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      allUsers,
      isLoading: isLoading || loginApi.loading || signupApi.loading,
      login,
      signup,
      logout,
      updateUserProfile,
      uploadAvatar,
      addDevAccount,
      deleteDevAccount,
      updateDevStatus,
      refreshUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
