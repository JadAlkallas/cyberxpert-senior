
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Home, User, Book, PieChart, ChevronLeft, ChevronRight, MessageSquare, Users } from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const { reports } = useData();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Debug logging
  console.log("Sidebar: Current user:", user);
  console.log("Sidebar: User role:", user?.role);
  console.log("Sidebar: Is admin?", user?.role?.toLowerCase() === "admin");
  
  // Only show sidebar for authenticated users
  if (!user) return null;
  
  // Get pending users count for notification badge
  const pendingUsersCount = user.role?.toLowerCase() === "admin" ? 
    JSON.parse(localStorage.getItem("cyberxpert-pending-users") || "[]").length : 0;
  
  // Get unread reports count
  const unreadReportsCount = user.role?.toLowerCase() === "admin" ? 
    reports.filter(report => !report.read).length : 0;
  
  // Build menu items dynamically based on user role
  const menuItems = [
    { name: "Home", path: "/home", icon: <Home className="h-5 w-5" /> },
    { name: "Account", path: "/account", icon: <User className="h-5 w-5" /> },
    { name: "Repository", path: "/repository", icon: <Book className="h-5 w-5" /> },
    { 
      name: "Reports", 
      path: "/reports", 
      icon: <PieChart className="h-5 w-5" />,
      badge: user.role?.toLowerCase() === "admin" && unreadReportsCount > 0 ? unreadReportsCount : null 
    },
    { name: "Chatbot", path: "/chatbot", icon: <MessageSquare className="h-5 w-5" /> },
  ];
  
  // Add admin-only menu items
  if (user.role?.toLowerCase() === "admin") {
    console.log("Sidebar: Adding User Management for admin");
    menuItems.push({ 
      name: "User Management", 
      path: "/admin/users", 
      icon: <Users className="h-5 w-5" />,
      badge: pendingUsersCount > 0 ? pendingUsersCount : null
    });
  } else {
    console.log("Sidebar: Not adding User Management - user role is:", user.role);
  }
  
  console.log("Sidebar: Final menu items:", menuItems);
  
  return (
    <div
      className={cn(
        "h-screen bg-cyber-dark-gray text-white border-r border-gray-800 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex-1 py-6 px-2">
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors relative",
                  location.pathname === item.path
                    ? "bg-cyber-orange text-white"
                    : "text-gray-300 hover:bg-gray-800"
                )}
              >
                <div>{item.icon}</div>
                {!collapsed && <span>{item.name}</span>}
                
                {/* Notification badge */}
                {item.badge && (
                  <div className={cn(
                    "absolute flex items-center justify-center rounded-full bg-red-500 text-white font-medium text-xs min-w-5 h-5 p-1",
                    collapsed ? "right-0 top-0 -mt-1 -mr-1" : "right-3"
                  )}>
                    {item.badge}
                  </div>
                )}
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
