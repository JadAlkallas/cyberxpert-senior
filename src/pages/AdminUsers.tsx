import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, User, UserPlus, UserX, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Form schema for adding new accounts
const accountSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters"
  }),
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters"
  }),
  confirmPassword: z.string(),
  role: z.enum(["developer", "admin"]),
  status: z.enum(["active", "suspended"])
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
type AccountFormValues = z.infer<typeof accountSchema>;

const AdminUsers = () => {
  const {
    user,
    allUsers,
    addDevAccount,
    deleteDevAccount,
    updateDevStatus
  } = useAuth();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "developer",
      status: "active"
    }
  });

  // Debug logging
  console.log("AdminUsers: Current user:", user);
  console.log("AdminUsers: User role:", user?.role);
  console.log("AdminUsers: Is admin?", user?.role?.toLowerCase() === "admin");
  console.log("AdminUsers: Rendering admin panel");
  
  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setProcessingId(userId);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      deleteDevAccount(userId);
      setProcessingId(null);
    }
  };
  
  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    setProcessingId(userId);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    updateDevStatus(userId, newStatus as "active" | "suspended");
    setProcessingId(null);
  };
  
  const onSubmit = async (values: AccountFormValues) => {
    setIsSubmitting(true);
    const result = await addDevAccount(values.username, values.email, values.password, values.role, values.status);
    if (result) {
      form.reset();
    }
    setIsSubmitting(false);
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
              <p className="text-gray-600">Manage all user accounts and permissions</p>
            </div>
            
            <Tabs defaultValue="users" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="users">All Accounts</TabsTrigger>
                <TabsTrigger value="add">Add Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>All Accounts</CardTitle>
                    <CardDescription>View and manage all user accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {allUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No user accounts found
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allUsers.map(user => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {user.role === "developer" ? (
                                    <User className="h-3.5 w-3.5 mr-1" />
                                  ) : (
                                    <Shield className="h-3.5 w-3.5 mr-1" />
                                  )}
                                  {user.role}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  user.status === "active" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {user.status === "active" ? (
                                    <UserCheck className="h-3.5 w-3.5 mr-1" />
                                  ) : (
                                    <UserX className="h-3.5 w-3.5 mr-1" />
                                  )}
                                  {user.status === "active" ? "Active" : "Suspended"}
                                </span>
                              </TableCell>
                              <TableCell>
                                {format(new Date(user.createdAt), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    size="sm" 
                                    variant={user.status === "active" ? "destructive" : "outline"} 
                                    className="h-8" 
                                    onClick={() => handleToggleStatus(user.id, user.status)} 
                                    disabled={processingId === user.id}
                                  >
                                    {processingId === user.id ? (
                                      <LoadingSpinner size="sm" className="mr-1" />
                                    ) : user.status === "active" ? (
                                      <UserX className="h-4 w-4 mr-1" />
                                    ) : (
                                      <UserCheck className="h-4 w-4 mr-1" />
                                    )}
                                    {user.status === "active" ? "Suspend" : "Activate"}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive" 
                                    className="h-8" 
                                    onClick={() => handleDelete(user.id)} 
                                    disabled={processingId === user.id}
                                  >
                                    {processingId === user.id ? (
                                      <LoadingSpinner size="sm" className="mr-1" />
                                    ) : (
                                      <UserX className="h-4 w-4 mr-1" />
                                    )}
                                    Delete
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
              </TabsContent>
              
              <TabsContent value="add">
                <Card>
                  <CardHeader>
                    <CardTitle>Add User Account</CardTitle>
                    <CardDescription>Create a new user account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField 
                          control={form.control} 
                          name="username" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="johndoe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                        
                        <FormField control={form.control} name="email" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="password" render={({
                          field
                        }) => <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                          
                          <FormField control={form.control} name="confirmPassword" render={({
                          field
                        }) => <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                        </div>
                        
                        <FormField control={form.control} name="role" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>Role</FormLabel>
                              <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="developer" id="role-developer" />
                                    <Label htmlFor="role-developer" className="flex items-center">
                                      <User className="h-4 w-4 mr-2" />
                                      Developer
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="admin" id="role-admin" />
                                    <Label htmlFor="role-admin" className="flex items-center">
                                      <Shield className="h-4 w-4 mr-2" />
                                      Administrator
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        
                        <FormField control={form.control} name="status" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>Status</FormLabel>
                              <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="active" id="status-active" />
                                    <Label htmlFor="status-active" className="flex items-center">
                                      <UserCheck className="h-4 w-4 mr-2" />
                                      Active
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="suspended" id="status-suspended" />
                                    <Label htmlFor="status-suspended" className="flex items-center">
                                      <UserX className="h-4 w-4 mr-2" />
                                      Suspended
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormDescription>
                                Suspended users can log in but cannot perform testing actions
                              </FormDescription>
                              <FormMessage />
                            </FormItem>} />
                        
                        <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                          {isSubmitting ? <>
                              <LoadingSpinner size="sm" />
                              Creating Account...
                            </> : <>
                              <UserPlus className="h-4 w-4" />
                              Create User Account
                            </>}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
