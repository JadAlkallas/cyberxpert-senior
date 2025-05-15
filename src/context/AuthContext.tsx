
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
  allUsers: User[];
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
  
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const savedDevs = localStorage.getItem("cyberxpert-devs");
    const devUsers = savedDevs ? JSON.parse(savedDevs) : [];
    
    // Initialize with admin users if they exist
    const savedAdmins = localStorage.getItem("cyberxpert-admins");
    const adminUsers = savedAdmins ? JSON.parse(savedAdmins) : [];
    
    return [...devUsers, ...adminUsers];
  });
  
  const navigate = useNavigate();

  const isAuthenticated = !!user && (user.status === "active" || user.role === "Admin");
  
  useEffect(() => {
    // Save all devs
    const devUsers = allUsers.filter(user => user.role === "Dev");
    localStorage.setItem("cyberxpert-devs", JSON.stringify(devUsers));
    
    // Save all admins
    const adminUsers = allUsers.filter(user => user.role === "Admin");
    localStorage.setItem("cyberxpert-admins", JSON.stringify(adminUsers));
  }, [allUsers]);

  // Mock login - in a real app this would call an API
  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if this is a registered user
      const existingUser = allUsers.find(
        u => u.username === username && u.role === role
      );
      
      if (existingUser) {
        if (existingUser.status === "suspended") {
          setUser(existingUser); // Allow login but with restricted access
          localStorage.setItem("cyberxpert-user", JSON.stringify(existingUser));
          toast.warning("Your account has been suspended. Contact an administrator for assistance.");
          return true;
        }
        
        // Login as existing user
        setUser(existingUser);
        localStorage.setItem("cyberxpert-user", JSON.stringify(existingUser));
        toast.success(`Welcome back, ${username}!`);
        return true;
      }
      
      // In a real app, validate credentials against an API
      if (password.length < 6) {
        toast.error("Invalid credentials");
        return false;
      }

      // Create a mock admin user if role is admin and doesn't exist yet
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
        setAllUsers(prev => [...prev, newUser]);
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
        setAllUsers(prev => [...prev, newUser]);
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
      
      // Also update the user in the allUsers list
      setAllUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, ...updates } : u
      ));
      
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
      const existingUser = allUsers.find(
        u => u.username === username || u.email === email
      );
      
      if (existingUser) {
        toast.error("A user with this username or email already exists");
        return false;
      }
      
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }
      
      // Create new user account
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        username,
        email,
        role,
        status,
        createdAt: new Date().toISOString(),
        avatarUrl: "/placeholder.svg"
      };
      
      setAllUsers(prev => [...prev, newUser]);
      toast.success(`${role} account created successfully for ${username}`);
      return true;
    } catch (error) {
      console.error("Add account error:", error);
      toast.error("Failed to create account");
      return false;
    }
  };
  
  const deleteDevAccount = (userId: string) => {
    const userToDelete = allUsers.find(u => u.id === userId);
    
    if (userToDelete) {
      setAllUsers(prev => prev.filter(u => u.id !== userId));
      toast.success(`Deleted user: ${userToDelete.username}`);
    }
  };
  
  const updateDevStatus = (userId: string, status: UserStatus) => {
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { ...u, status } : u
    );
    
    setAllUsers(updatedUsers);
    
    const updatedUser = updatedUsers.find(u => u.id === userId);
    if (updatedUser) {
      toast.success(`Updated ${updatedUser.username}'s status to ${status}`);
      
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
      allUsers,
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
