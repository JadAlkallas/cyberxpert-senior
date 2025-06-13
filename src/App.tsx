import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProviderComponent } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Action from "./pages/Action";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Repository from "./pages/Repository";
import Reports from "./pages/Reports";
import Chatbot from "./pages/Chatbot";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Helper function to check if user is admin (handles case sensitivity)
const isUserAdmin = (userRole: string) => {
  return userRole?.toLowerCase() === "admin";
};

// Protected route wrapper - only checks for token
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  console.log("ProtectedRoute: isAuthenticated", isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Admin route wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  console.log("AdminRoute: user", user);
  console.log("AdminRoute: user role", user?.role);
  console.log("AdminRoute: is admin?", isUserAdmin(user?.role || ''));
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!isUserAdmin(user.role || '')) {
    console.log("AdminRoute: Not admin, redirecting to home");
    return <Navigate to="/home" />;
  }
  
  console.log("AdminRoute: Admin confirmed, rendering children");
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    
    {/* Protected routes */}
    <Route path="/action" element={<ProtectedRoute><Action /></ProtectedRoute>} />
    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
    <Route path="/repository" element={<ProtectedRoute><Repository /></ProtectedRoute>} />
    <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
    <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
    
    {/* Admin routes */}
    <Route path="/admin/users" element={
      <ProtectedRoute>
        <AdminRoute>
          <AdminUsers />
        </AdminRoute>
      </ProtectedRoute>
    } />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProviderComponent>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <AppRoutes />
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProviderComponent>
  </QueryClientProvider>
);

export default App;
