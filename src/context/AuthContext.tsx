
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

export type UserRole = "Admin" | "Dev";
export type UserStatus = "active" | "suspended";

interface User {
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
  allDevs: User[];
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (username: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  addDevAccount: (username: string, email: string, password: string, role: UserRole, status: UserStatus) => Promise<boolean>;
  deleteDevAccount: (userId: string) => void;
  updateDevStatus: (userId: string, status: UserStatus) => void;
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
  
  const [allDevs, setAllDevs] = useState<User[]>(() => {
    const savedDevs = localStorage.getItem("cyberxpert-devs");
    return savedDevs ? JSON.parse(savedDevs) : [];
  });
  
  const navigate = useNavigate();

  const isAuthenticated = !!user && (user.status === "active" || user.role === "Admin");
  
  useEffect(() => {
    localStorage.setItem("cyberxpert-devs", JSON.stringify(allDevs));
  }, [allDevs]);

  // Mock login - in a real app this would call an API
  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if this is a registered dev
      const existingDev = allDevs.find(
        dev => dev.username === username && dev.role === role
      );
      
      if (existingDev) {
        if (existingDev.status === "suspended") {
          setUser(existingDev); // Allow login but with restricted access
          localStorage.setItem("cyberxpert-user", JSON.stringify(existingDev));
          toast.warning("Your account has been suspended. Contact an administrator for assistance.");
          return true;
        }
        
        // Login as existing dev
        setUser(existingDev);
        localStorage.setItem("cyberxpert-user", JSON.stringify(existingDev));
        toast.success(`Welcome back, ${username}!`);
        return true;
      }
      
      // In a real app, validate credentials against an API
      if (password.length < 6) {
        toast.error("Invalid credentials");
        return false;
      }

      // Create a mock admin user if role is admin
      if (role === "Admin") {
        const newUser: User = {
          id: Math.random().toString(36).substring(2, 9),
          username,
          email: `${username}@example.com`,
          role,
          status: "active",
          createdAt: new Date().toISOString(),
          avatarUrl: "/placeholder.svg"
        };

        setUser(newUser);
        localStorage.setItem("cyberxpert-user", JSON.stringify(newUser));
        toast.success(`Welcome back, ${username}!`);
        
        return true;
      }
      
      toast.error("User not found");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    }
  };

  // Mock signup - in a real app this would call an API
  const signup = async (username: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would send data to an API
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }

      // Only Admin signup is allowed
      if (role === "Admin") {
        const newUser: User = {
          id: Math.random().toString(36).substring(2, 9),
          username,
          email,
          role,
          status: "active",
          createdAt: new Date().toISOString(),
          avatarUrl: "/placeholder.svg"
        };

        setUser(newUser);
        localStorage.setItem("cyberxpert-user", JSON.stringify(newUser));
        toast.success("Admin account created successfully!");
        return true;
      } else {
        toast.error("Only Admin accounts can be created via signup");
        return false;
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cyberxpert-user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("cyberxpert-user", JSON.stringify(updatedUser));
      
      // Also update the user in the allDevs list if they exist there
      if (user.role === "Dev") {
        setAllDevs(prev => prev.map(dev => 
          dev.id === user.id ? { ...dev, ...updates } : dev
        ));
      }
      
      toast.success("Profile updated successfully");
    }
  };
  
  const addDevAccount = async (
    username: string, 
    email: string, 
    password: string, 
    role: UserRole,
    status: UserStatus
  ): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if username or email already exists
      const existingDev = allDevs.find(
        dev => dev.username === username || dev.email === email
      );
      
      if (existingDev) {
        toast.error("A user with this username or email already exists");
        return false;
      }
      
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }
      
      // Create new dev account
      const newDev: User = {
        id: Math.random().toString(36).substring(2, 9),
        username,
        email,
        role,
        status,
        createdAt: new Date().toISOString(),
        avatarUrl: "/placeholder.svg"
      };
      
      setAllDevs(prev => [...prev, newDev]);
      toast.success(`Dev account created successfully for ${username}`);
      return true;
    } catch (error) {
      console.error("Add dev account error:", error);
      toast.error("Failed to create dev account");
      return false;
    }
  };
  
  const deleteDevAccount = (userId: string) => {
    const devToDelete = allDevs.find(dev => dev.id === userId);
    
    if (devToDelete) {
      setAllDevs(prev => prev.filter(dev => dev.id !== userId));
      toast.success(`Deleted user: ${devToDelete.username}`);
    }
  };
  
  const updateDevStatus = (userId: string, status: UserStatus) => {
    const updatedDevs = allDevs.map(dev => 
      dev.id === userId ? { ...dev, status } : dev
    );
    
    setAllDevs(updatedDevs);
    
    const updatedDev = updatedDevs.find(dev => dev.id === userId);
    if (updatedDev) {
      toast.success(`Updated ${updatedDev.username}'s status to ${status}`);
      
      // If the currently logged in user is being updated, update their session too
      if (user && user.id === userId) {
        setUser({ ...user, status });
        localStorage.setItem("cyberxpert-user", JSON.stringify({ ...user, status }));
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      allDevs,
      login,
      signup,
      logout,
      updateUserProfile,
      addDevAccount,
      deleteDevAccount,
      updateDevStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};
