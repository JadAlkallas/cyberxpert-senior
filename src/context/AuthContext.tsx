
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

export type UserRole = "Admin" | "Dev";
export type UserStatus = "active" | "pending";

interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
}

interface PendingUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  pendingUsers: PendingUser[];
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (username: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  approvePendingUser: (userId: string) => void;
  rejectPendingUser: (userId: string) => void;
  getPendingUsers: () => PendingUser[];
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
  
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>(() => {
    const savedPendingUsers = localStorage.getItem("cyberxpert-pending-users");
    return savedPendingUsers ? JSON.parse(savedPendingUsers) : [];
  });
  
  const navigate = useNavigate();

  const isAuthenticated = !!user && user.status === "active";
  
  useEffect(() => {
    localStorage.setItem("cyberxpert-pending-users", JSON.stringify(pendingUsers));
  }, [pendingUsers]);

  // Mock login - in a real app this would call an API
  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if this is a pending user trying to log in
      const pendingUserIndex = pendingUsers.findIndex(
        pu => pu.username === username && pu.role === role
      );
      
      if (pendingUserIndex !== -1) {
        toast.error("Your account is pending approval from an admin");
        return false;
      }
      
      // In a real app, validate credentials against an API
      if (password.length < 6) {
        toast.error("Invalid credentials");
        return false;
      }

      // Create a mock user
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

      // If registering as Admin, create active user immediately
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
        // If Dev, add to pending users
        const newPendingUser: PendingUser = {
          id: Math.random().toString(36).substring(2, 9),
          username,
          email,
          role,
          createdAt: new Date().toISOString()
        };

        setPendingUsers(prev => [...prev, newPendingUser]);
        toast.success("Account registration submitted! Waiting for admin approval.");
        return true;
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
      toast.success("Profile updated successfully");
    }
  };
  
  const getPendingUsers = (): PendingUser[] => {
    return pendingUsers;
  };
  
  const approvePendingUser = (userId: string) => {
    const pendingUser = pendingUsers.find(pu => pu.id === userId);
    
    if (pendingUser) {
      // Remove from pending users
      setPendingUsers(prev => prev.filter(pu => pu.id !== userId));
      
      // In a real app, this would create the user in the DB
      toast.success(`Approved user: ${pendingUser.username}`);
    }
  };
  
  const rejectPendingUser = (userId: string) => {
    const pendingUser = pendingUsers.find(pu => pu.id === userId);
    
    if (pendingUser) {
      // Remove from pending users
      setPendingUsers(prev => prev.filter(pu => pu.id !== userId));
      
      // In a real app, this would notify the user
      toast.success(`Rejected user: ${pendingUser.username}`);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      pendingUsers,
      login,
      signup,
      logout,
      updateUserProfile,
      approvePendingUser,
      rejectPendingUser,
      getPendingUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};
