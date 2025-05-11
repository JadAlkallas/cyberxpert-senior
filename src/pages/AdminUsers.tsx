
import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Shield, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const AdminUsers = () => {
  const { user, pendingUsers, approvePendingUser, rejectPendingUser } = useAuth();
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Redirect if not an admin
  if (user?.role !== "Admin") {
    navigate("/home");
    return null;
  }

  const handleApprove = async (userId: string) => {
    setProcessingId(userId);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    approvePendingUser(userId);
    setProcessingId(null);
  };

  const handleReject = async (userId: string) => {
    setProcessingId(userId);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    rejectPendingUser(userId);
    setProcessingId(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 bg-gray-50 p-6">
          <div className="container mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">User Management</h1>
              <p className="text-gray-600">Manage pending account requests and user permissions</p>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Developer accounts pending admin approval</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No pending user approvals
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.map((pendingUser) => (
                        <TableRow key={pendingUser.id}>
                          <TableCell className="font-medium">{pendingUser.username}</TableCell>
                          <TableCell>{pendingUser.email}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {pendingUser.role === "Dev" ? (
                                <User className="h-3.5 w-3.5 mr-1" />
                              ) : (
                                <Shield className="h-3.5 w-3.5 mr-1" />
                              )}
                              {pendingUser.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            {format(new Date(pendingUser.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 border-green-500 text-green-600 hover:bg-green-50"
                                onClick={() => handleApprove(pendingUser.id)}
                                disabled={processingId === pendingUser.id}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 border-red-500 text-red-600 hover:bg-red-50"
                                onClick={() => handleReject(pendingUser.id)}
                                disabled={processingId === pendingUser.id}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
