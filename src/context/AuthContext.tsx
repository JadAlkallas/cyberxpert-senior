
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/services/authApi";
import { useApi } from "@/hooks/useApi";

// Updated to match Laravel backend validation
export type UserRole = "admin" | "developer" | "security_analyst";
export type UserStatus = "active" | "suspended" | "inactive";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  allUsers: User[];
  isLoading: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (username: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
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

  // Helper function to check if user is admin - handles case sensitivity
  const isUserAdmin = (userRole: string) => {
    return userRole?.toLowerCase() === "admin";
  };

  const isAuthenticated = !!user && (user.status === "active" || isUserAdmin(user.role));
  
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token && !user) {
      // Try to get user profile with existing token
      authApi.getProfile()
        .then(userData => {
          setUser(userData);
          localStorage.setItem("cyberxpert-user", JSON.stringify(userData));
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem('auth-token');
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
      setAllUsers(users);
    }
  };

  // Login function
  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const result = await loginApi.execute({ username, password, role });
      
      if (result) {
        setUser(result.user);
        localStorage.setItem("cyberxpert-user", JSON.stringify(result.user));
        localStorage.setItem("auth-token", result.token);
        localStorage.setItem("refresh-token", result.refreshToken);
        
        if (result.user.status === "suspended") {
          toast.warning("Your account has been suspended. Contact an administrator for assistance.");
        } else {
          toast.success(`Welcome back, ${username}!`);
        }
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Signup function
  const signup = async (username: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const result = await signupApi.execute({ username, email, password, role });
      
      if (result) {
        setUser(result.user);
        localStorage.setItem("cyberxpert-user", JSON.stringify(result.user));
        localStorage.setItem("auth-token", result.token);
        localStorage.setItem("refresh-token", result.refreshToken);
        
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
      localStorage.removeItem("auth-token");
      localStorage.removeItem("refresh-token");
      navigate("/login");
      toast.success("Logged out successfully");
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    const result = await updateProfileApi.execute(updates);
    
    if (result) {
      setUser(result);
      localStorage.setItem("cyberxpert-user", JSON.stringify(result));
      
      // Also update the user in the allUsers list if it exists
      setAllUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, ...updates } : u
      ));
      
      return true;
    }
    
    return false;
  };
  
  const addDevAccount = async (
    username: string, 
    email: string, 
    password: string, 
    role: UserRole,
    status: UserStatus
  ): Promise<boolean> => {
    console.log("addDevAccount: Starting user creation process");
    console.log("addDevAccount: Current user:", user);
    console.log("addDevAccount: Current user role:", user?.role);
    console.log("addDevAccount: Is current user admin?", isUserAdmin(user?.role || ''));
    console.log("addDevAccount: Auth token:", localStorage.getItem("auth-token"));
    console.log("addDevAccount: Request data:", { username, email, role, status });
    
    const result = await createUserApi.execute({
      username,
      email,
      password,
      role,
      status
    });
    
    console.log("addDevAccount: API response:", result);
    
    if (result) {
      setAllUsers(prev => [...prev, result]);
      console.log("addDevAccount: User created successfully");
      return true;
    }
    
    console.log("addDevAccount: User creation failed");
    return false;
  };
  
  const deleteDevAccount = async (userId: string): Promise<boolean> => {
    const result = await deleteUserApi.execute(userId);
    
    if (result?.success) {
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
    const result = await updateUserApi.execute(userId, { status });
    
    if (result) {
      setAllUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status } : u
      ));
      
      toast.success(`Updated ${result.username}'s status to ${status}`);
      
      // If the currently logged in user is being updated, update their session too
      if (user && user.id === userId) {
        const updatedUser = { ...user, status };
        setUser(updatedUser);
        localStorage.setItem("cyberxpert-user", JSON.stringify(updatedUser));
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
