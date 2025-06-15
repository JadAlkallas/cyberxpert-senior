import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/services/authApi";
import { useApi } from "@/hooks/useApi";
import { decodeJWT } from "@/utils/jwt";

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
  addDevAccount: (username: string, firstName: string, lastName: string, email: string, password: string, role: UserRole, status: UserStatus) => Promise<boolean>;
  deleteDevAccount: (userId: string) => Promise<boolean>;
  updateDevStatus: (userId: string, status: UserStatus) => Promise<boolean>;
  refreshUsers: () => Promise<void>;
  refreshCurrentUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper function to normalize Django user data - robust detection with __sourceRole override
const normalizeUser = (djangoUser: any): User => {
  console.log("Normalizing Django user:", djangoUser);

  let userRole: UserRole = 'developer'; // Default to developer

  // Prefer __sourceRole if present (as patched by authApi)
  if (djangoUser.__sourceRole === "admin" || djangoUser.__sourceRole === "developer") {
    userRole = djangoUser.__sourceRole;
  } else if (
    typeof djangoUser.role === 'string' && djangoUser.role.toLowerCase() === 'admin'
  ) {
    userRole = 'admin';
  } else if (
    (typeof djangoUser.is_staff === 'boolean' && djangoUser.is_staff) ||
    (typeof djangoUser.is_superuser === 'boolean' && djangoUser.is_superuser)
  ) {
    userRole = 'admin';
  }

  // Debug print
  console.log("Detected role for user:", {
    username: djangoUser.username,
    __sourceRole: djangoUser.__sourceRole,
    role: djangoUser.role,
    is_staff: djangoUser.is_staff,
    is_superuser: djangoUser.is_superuser,
    userRole
  });

  return {
    id: djangoUser.id ? String(djangoUser.id) : "unknown",
    username: djangoUser.username || "unknown",
    email: djangoUser.email || "",
    role: userRole,
    status: djangoUser.is_active ? 'active' : 'suspended',
    is_active: djangoUser.is_active !== false,
    avatarUrl: djangoUser.avatar || djangoUser.avatarUrl,
    avatar: djangoUser.avatar,
    createdAt: djangoUser.date_joined || djangoUser.createdAt || new Date().toISOString(),
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

  // API hooks - Updated loginApi to not show error toast automatically
  const loginApi = useApi(authApi.login, {
    showErrorToast: false // We'll handle login errors manually
  });
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
  const activateUserApi = useApi(authApi.activateUser, {
    showSuccessToast: true
  });
  const deactivateUserApi = useApi(authApi.deactivateUser, {
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

  // Check authentication based on token presence only
  const isAuthenticated = !!localStorage.getItem('access-token');
  
  // Helper function to refresh current user state
  const refreshCurrentUser = () => {
    console.log("Refreshing current user state");
    const token = localStorage.getItem('access-token');
    if (token) {
      const tokenData = decodeJWT(token);
      if (tokenData && user) {
        const refreshedUser: User = {
          ...user,
          role: tokenData.is_staff ? "admin" : "developer",
          status: user.is_active ? "active" : "suspended",
        };
        console.log("Refreshed user:", refreshedUser);
        setUser(refreshedUser);
        localStorage.setItem("cyberxpert-user", JSON.stringify(refreshedUser));
      }
    }
  };

  // Load all users for admin - Fixed to refresh properly
  useEffect(() => {
    console.log("useEffect: user changed:", user);
    console.log("useEffect: user role:", user?.role);
    console.log("useEffect: is admin?", isUserAdmin(user?.role || ''));
    
    if (user && isUserAdmin(user.role)) {
      console.log("useEffect: Refreshing users for admin");
      refreshUsers();
    }
  }, [user]);

  // Refresh users list (admin only) - Enhanced logging
  const refreshUsers = async (): Promise<void> => {
    console.log("refreshUsers: Starting refresh");
    console.log("refreshUsers: Current user:", user);
    console.log("refreshUsers: Is admin?", isUserAdmin(user?.role || ''));
    
    if (!isUserAdmin(user?.role || '')) {
      console.log("refreshUsers: Not admin, skipping");
      return;
    }
    
    console.log("refreshUsers: Fetching users from API");
    const users = await getAllUsersApi.execute();
    console.log("refreshUsers: API response:", users);
    
    if (users) {
      const normalizedUsers = users.map(normalizeUser);
      console.log("refreshUsers: Normalized users:", normalizedUsers);
      setAllUsers(normalizedUsers);
    }
  };

  // Login function - Updated to handle suspended accounts better
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log("AuthContext: Starting login for username:", username);
      
      // Get tokens from login endpoint
      const result = await loginApi.execute({ username, password });
      console.log("AuthContext: Login API result:", result);
      
      if (result && result.access && result.refresh) {
        // Store tokens
        localStorage.setItem("access-token", result.access);
        localStorage.setItem("refresh-token", result.refresh);
        
        // Decode the JWT token to get user data
        const tokenData = decodeJWT(result.access);
        console.log("AuthContext: Decoded token data:", tokenData);
        
        if (tokenData) {
          // Create user object from token data
          const userFromToken: User = {
            id: tokenData.user_id ? String(tokenData.user_id) : "1",
            username: tokenData.username || username,
            email: tokenData.email || `${username}@example.com`,
            role: tokenData.is_staff ? "admin" : "developer", // Use is_staff to determine role
            status: "active", // Default to active on login
            is_active: true,
            createdAt: new Date().toISOString(),
          };
          
          console.log("AuthContext: User object created from token:", userFromToken);
          
          setUser(userFromToken);
          localStorage.setItem("cyberxpert-user", JSON.stringify(userFromToken));
          
          console.log("AuthContext: User role set to:", userFromToken.role);
          console.log("AuthContext: is_staff from token:", tokenData.is_staff);
          
          toast.success(`Welcome back, ${username}!`);
          
          console.log("AuthContext: Login successful");
          setIsLoading(false);
          return true;
        } else {
          console.error("AuthContext: Failed to decode token");
          toast.error("Login failed. Please try again.");
          setIsLoading(false);
          return false;
        }
      }
      
      // If we get here, login failed - result is null
      console.log("AuthContext: Login failed - no result from API");
      
      // The error should be available in loginApi.error now
      const errorMessage = loginApi.error;
      console.log("AuthContext: Error message from API:", errorMessage);
      
      // Handle specific error cases based on the actual Django error message
      if (errorMessage && errorMessage.includes("No active account found with the given credentials")) {
        toast.error("Your account has been suspended. Please contact an administrator to reactivate your account.");
      } else if (errorMessage && (errorMessage.includes("Invalid credentials") || errorMessage.includes("authentication failed"))) {
        toast.error("Login failed. Please check your username and password.");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      
      // Handle specific error cases from the catch block
      if (error instanceof Error) {
        if (error.message.includes("No active account found with the given credentials")) {
          toast.error("Your account has been suspended. Please contact an administrator to reactivate your account.");
        } else if (error.message.includes("Invalid credentials")) {
          toast.error("Login failed. Please check your username and password.");
        } else {
          toast.error("Login failed. Please try again or contact support if the problem persists.");
        }
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
      
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
        
        // Create user object from signup data
        const newUser: User = {
          id: "1", // Default ID
          username: username,
          email: email,
          role: role,
          status: "active",
          is_active: true,
          createdAt: new Date().toISOString(),
        };
        
        setUser(newUser);
        localStorage.setItem("cyberxpert-user", JSON.stringify(newUser));
        
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
    
    console.log("Updating user profile with:", updates);
    
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
      console.log("Profile update result:", normalizedUser);
      
      // Update current user state
      setUser(normalizedUser);
      localStorage.setItem("cyberxpert-user", JSON.stringify(normalizedUser));
      
      // Also update the user in the allUsers list if it exists
      setAllUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, ...normalizedUser } : u
      ));
      
      console.log("User profile updated successfully");
      return true;
    }
    
    return false;
  };

  // New avatar upload function - Updated to pass user role
  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    const result = await uploadAvatarApi.execute(file, user.role);
    
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
    firstName: string,
    lastName: string,
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
    console.log("Parameters received:");
    console.log("- username:", username);
    console.log("- firstName:", firstName);
    console.log("- lastName:", lastName);
    console.log("- email:", email);
    console.log("- role:", role);
    console.log("- status:", status);
    
    if (!user || !isUserAdmin(user.role)) {
      toast.error("Access denied: Admin privileges required");
      return false;
    }
    
    const result = await createUserApi.execute({
      username: username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      password2: password,
      role,
      is_active: status === 'active'
    });
    
    if (result) {
      console.log("User created successfully:", result);
      const normalizedUser = normalizeUser(result);
      console.log("Adding normalized user to list:", normalizedUser);
      setAllUsers(prev => {
        const updated = [...prev, normalizedUser];
        console.log("Updated users list:", updated);
        return updated;
      });
      return true;
    }
    
    return false;
  };
  
  const deleteDevAccount = async (userId: string): Promise<boolean> => {
    const userToDelete = allUsers.find(u => u.id === userId);
    if (!userToDelete) return false;

    const result = await deleteUserApi.execute(userId, userToDelete.role);
    
    if (result) {
      setAllUsers(prev => prev.filter(u => u.id !== userId));
      toast.success(`Deleted user: ${userToDelete.username}`);
      return true;
    }
    
    return false;
  };
  
  const updateDevStatus = async (userId: string, status: UserStatus): Promise<boolean> => {
    const userToUpdate = allUsers.find(u => u.id === userId);
    if (!userToUpdate) return false;

    let result;
    if (status === 'active') {
      result = await activateUserApi.execute(userId, userToUpdate.role);
    } else {
      result = await deactivateUserApi.execute(userId, userToUpdate.role);
    }
    
    if (result) {
      // Instead of normalizing the API response (which is just a message),
      // manually update the user object with the new status
      const updatedUser: User = {
        ...userToUpdate,
        status: status,
        is_active: status === 'active'
      };
      
      console.log("Updated user object:", updatedUser);
      
      setAllUsers(prev => prev.map(u => 
        u.id === userId ? updatedUser : u
      ));
      
      toast.success(`Updated ${updatedUser.username}'s status to ${status}`);
      
      // If the currently logged in user is being updated, update their session too
      if (user && user.id === userId) {
        console.log("Updating current user status to:", status);
        const updatedCurrentUser = { ...user, status, is_active: status === 'active' };
        setUser(updatedCurrentUser);
        localStorage.setItem("cyberxpert-user", JSON.stringify(updatedCurrentUser));
        
        // If user is suspended, they should be logged out
        if (status === 'suspended') {
          toast.warning("Your account has been suspended. You will be logged out.");
          setTimeout(() => logout(), 2000);
        }
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
      refreshUsers,
      refreshCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
