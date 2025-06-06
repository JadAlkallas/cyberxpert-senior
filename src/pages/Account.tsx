
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { toast } from "@/components/ui/sonner";
import { Loader, User } from "lucide-react";

const Account = () => {
  const { user, updateUserProfile } = useAuth();
  const { analyticsData } = useData();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Only validate passwords if any password field is filled
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }
      
      if (formData.newPassword && formData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsUpdating(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user profile
      updateUserProfile({
        username: formData.username,
        email: formData.email,
      });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 bg-gray-50 p-6">
          <div className="container mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Account</h1>
              <p className="text-gray-600">Manage your account settings and view analytics</p>
            </div>
            
            <Tabs defaultValue="dashboard">
              <TabsList className="mb-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="space-y-6">
                {/* Analytics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnalyticsChart 
                    data={analyticsData} 
                    type="bar" 
                    dataKey="testsOverTime" 
                    title="Tests Over Time"
                  />
                  
                  <AnalyticsChart 
                    data={analyticsData} 
                    type="pie" 
                    dataKey="scoreDistribution" 
                    title="Score Distribution"
                  />
                  
                  <AnalyticsChart 
                    data={analyticsData} 
                    type="bar" 
                    dataKey="vulnerabilityCategories" 
                    title="Vulnerability Categories"
                    height={350}
                  />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Activity Summary</CardTitle>
                      <CardDescription>Your security testing overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Tests Run</span>
                          <span className="font-medium">{analyticsData.totalTests}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Average Security Score</span>
                          <span className="font-medium">{analyticsData.averageScore}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Critical Issues Detected</span>
                          <span className="font-medium text-red-600">{analyticsData.criticalIssues}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Issues Resolved</span>
                          <span className="font-medium text-green-600">{analyticsData.resolvedIssues}</span>
                        </div>
                        <div className="border-t pt-4 mt-4">
                          <div className="text-sm font-medium mb-2">Security Trend</div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-cyber-orange rounded-full"
                              style={{ width: `${analyticsData.averageScore}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Settings */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>Update your account information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="username" className="block text-sm font-medium">
                            Username
                          </label>
                          <Input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange}
                            disabled={isUpdating}
                            className={errors.username ? "border-red-500" : ""}
                          />
                          {errors.username && (
                            <p className="text-red-500 text-xs">{errors.username}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="email" className="block text-sm font-medium">
                            Email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={isUpdating}
                            className={errors.email ? "border-red-500" : ""}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs">{errors.email}</p>
                          )}
                        </div>
                        
                        <div className="pt-4 border-t">
                          <h3 className="text-lg font-medium mb-4">Change Password</h3>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label htmlFor="currentPassword" className="block text-sm font-medium">
                                Current Password
                              </label>
                              <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                disabled={isUpdating}
                                className={errors.currentPassword ? "border-red-500" : ""}
                              />
                              {errors.currentPassword && (
                                <p className="text-red-500 text-xs">{errors.currentPassword}</p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <label htmlFor="newPassword" className="block text-sm font-medium">
                                New Password
                              </label>
                              <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                disabled={isUpdating}
                                className={errors.newPassword ? "border-red-500" : ""}
                              />
                              {errors.newPassword && (
                                <p className="text-red-500 text-xs">{errors.newPassword}</p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                                Confirm New Password
                              </label>
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                disabled={isUpdating}
                                className={errors.confirmPassword ? "border-red-500" : ""}
                              />
                              {errors.confirmPassword && (
                                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? (
                              <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                  
                  {/* Account Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Info</CardTitle>
                      <CardDescription>Your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center">
                        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                          {user?.avatarUrl ? (
                            <img 
                              src={user.avatarUrl} 
                              alt="Profile" 
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-10 w-10 text-gray-500" />
                          )}
                        </div>
                        <h3 className="text-lg font-medium">{user?.username}</h3>
                        <span className="text-sm text-gray-500">{user?.email}</span>
                        <span className="mt-1 text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {user?.role} Account
                        </span>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-500">Account created</span>
                          <span className="text-sm">May 1, 2025</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-500">Role</span>
                          <span className="text-sm">{user?.role}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Account;
