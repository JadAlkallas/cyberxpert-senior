
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Home, User, Book, PieChart, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Only show sidebar for authenticated users
  if (!user) return null;
  
  const menuItems = [
    { name: "Home", path: "/home", icon: <Home className="h-5 w-5" /> },
    { name: "Account", path: "/account", icon: <User className="h-5 w-5" /> },
    { name: "Repository", path: "/repository", icon: <Book className="h-5 w-5" /> },
    { name: "Reports", path: "/reports", icon: <PieChart className="h-5 w-5" /> },
    { name: "Chatbot", path: "/chatbot", icon: <MessageSquare className="h-5 w-5" /> },
  ];
  
  return (
    <div
      className={cn(
        "h-[calc(100vh-4rem)] bg-cyber-dark-gray text-white border-r border-gray-800 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex-1 py-6 px-2">
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-cyber-orange text-white"
                    : "text-gray-300 hover:bg-gray-800"
                )}
              >
                <div>{item.icon}</div>
                {!collapsed && <span>{item.name}</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Collapse button */}
      <div className="p-3 border-t border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
