
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut, Menu, X } from "lucide-react";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-cyber-orange flex items-center justify-center">
              <span className="text-white font-bold text-lg">CX</span>
            </div>
            <span className="text-xl font-bold hidden sm:block">CyberXpert</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <nav className="flex items-center gap-4">
                <Link to="/home" className="text-gray-700 hover:text-cyber-orange transition-colors">
                  Home
                </Link>
                <Link to="/account" className="text-gray-700 hover:text-cyber-orange transition-colors">
                  Account
                </Link>
                <Link to="/repository" className="text-gray-700 hover:text-cyber-orange transition-colors">
                  Repository
                </Link>
                <Link to="/reports" className="text-gray-700 hover:text-cyber-orange transition-colors">
                  Reports
                </Link>
              </nav>
              
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{user?.username}</span>
                  <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded">
                    {user?.role}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  title="Log out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-scale-up">
          <div className="container px-4 py-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 py-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{user?.username}</div>
                    <div className="text-xs text-gray-500">{user?.role}</div>
                  </div>
                </div>
                
                <nav className="flex flex-col py-3 gap-3">
                  <Link 
                    to="/home" 
                    className="text-gray-700 hover:text-cyber-orange px-2 py-1.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/account" 
                    className="text-gray-700 hover:text-cyber-orange px-2 py-1.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <Link 
                    to="/repository" 
                    className="text-gray-700 hover:text-cyber-orange px-2 py-1.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Repository
                  </Link>
                  <Link 
                    to="/reports" 
                    className="text-gray-700 hover:text-cyber-orange px-2 py-1.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reports
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="mt-2"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </Button>
                </nav>
              </>
            ) : (
              <div className="flex flex-col gap-3 py-3">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
