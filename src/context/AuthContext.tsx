
import { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

export type UserRole = "Admin" | "Dev";

interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (username: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
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
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  // Mock login - in a real app this would call an API
  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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

      // Create a new user
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        username,
        email,
        role,
        avatarUrl: "/placeholder.svg"
      };

      setUser(newUser);
      localStorage.setItem("cyberxpert-user", JSON.stringify(newUser));
      toast.success("Account created successfully!");
      
      return true;
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

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
