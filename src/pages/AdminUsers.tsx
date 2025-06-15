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

// Updated form schema to remove status field from form input
const accountSchema = z.object({
  username: z.string().optional(),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters"
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters"
  }),
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters"
  }),
  confirmPassword: z.string(),
  role: z.enum(["developer", "admin"]),
  // REMOVED: status
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
type AccountFormValues = z.infer<typeof accountSchema>;

// ---------- Extra type for local __sourceRole handling ONLY ----------
type UserWithSource = ReturnType<typeof useAuth>["allUsers"][number] & {
  __sourceRole?: string;
};

const defaultFormValues: AccountFormValues = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "developer"
  // REMOVED: status
};

const AdminUsers = () => {
  const {
    user,
    allUsers,
    addDevAccount,
    deleteDevAccount,
    updateDevStatus,
    refreshUsers
  } = useAuth();

  // Detect is_superuser and is_staff directly for rendering logic
  const isSuperUser = !!user?.is_superuser;
  const isAdminUser = !!user?.is_staff && !user.is_superuser;

  // ---- Improved Developer Filtering ----
  // If __sourceRole or role/is_staff isn't present, treat all as developers (default for /developers API).
  const developerUsers: UserWithSource[] = allUsers.filter((u) => {
    if ((u as any).__sourceRole) {
      return (u as any).__sourceRole === "developer";
    } else if (u.role) {
      return u.role === "developer";
    } else if (typeof u.is_staff === "boolean") {
      return u.is_staff === false;
    } else {
      // If there's no role/is_staff/__sourceRole, all users on /developers endpoint are developers by backend intent
      return true;
    }
  }) as UserWithSource[];

  const adminUsers: UserWithSource[] = allUsers.filter((u) => {
    if ((u as any).__sourceRole) {
      return (u as any).__sourceRole === "admin";
    } else if (u.role) {
      return u.role === "admin";
    } else if (typeof u.is_staff === "boolean") {
      return u.is_staff === true;
    } else {
      // If there's no role/is_staff/__sourceRole, these users are not "admin" (since they're on the /developers endpoint)
      return false;
    }
  }) as UserWithSource[];

  // Sort each by createdAt (newest first)
  const sortedDevelopers = [...developerUsers].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
  const sortedAdmins = [...adminUsers].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  // --- Action button logic ---
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    setProcessingId(userId);
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    await updateDevStatus(userId, nextStatus as "active" | "suspended");
    setProcessingId(null);
  };

  const handleDelete = async (userId: string) => {
    setProcessingId(userId);
    await deleteDevAccount(userId);
    setProcessingId(null);
  };

  // --- Add Account form logic ---
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: defaultFormValues
  });
  const { handleSubmit, formState, setValue } = form;
  const isSubmitting = formState.isSubmitting;

  // ----- Force role to developer for non-superusers -----
  // Set to "developer" when user changes to admin (prevents devs from "backdoor" admin creation)
  // This runs on initial mount and if isSuperUser/isAdminUser changes
  // Also: disables field if not superuser for full safety
  import { useEffect } from "react";
  useEffect(() => {
    if (isAdminUser && form.getValues("role") !== "developer") {
      setValue("role", "developer");
    }
  }, [isAdminUser, setValue]);
  
  const onSubmit = async (values: AccountFormValues) => {
    let username =
      values.username && values.username.trim() !== ""
        ? values.username.trim()
        : `${values.firstName.toLowerCase()}.${values.lastName.toLowerCase()}`.replace(/\s+/g, "");
    // Always send "active" as the status since backend ignores it and it's required by addDevAccount param signature
    const success = await addDevAccount(
      username,
      values.firstName,
      values.lastName,
      values.email,
      values.password,
      values.role,
      "active" // Send active; backend will ignore
    );
    if (success) {
      form.reset(defaultFormValues);
      await refreshUsers();
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
              <h1 className="text-3xl font-bold mb-2">User Management</h1>
              <p className="text-gray-600">Manage all user accounts and permissions</p>
            </div>
            <Tabs defaultValue="developers" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="developers">Developers</TabsTrigger>
                {isSuperUser && (
                  <TabsTrigger value="admins">Admins</TabsTrigger>
                )}
                <TabsTrigger value="add">Add Account</TabsTrigger>
              </TabsList>
              
              
              <TabsContent value="developers">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Developer Accounts ({sortedDevelopers.length})
                    </CardTitle>
                    <CardDescription>
                      View and manage all developer user accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {sortedDevelopers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No developer accounts found.
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
                          {sortedDevelopers.map(user => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  <User className="h-3.5 w-3.5 mr-1" />
                                  developer
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
                                {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "N/A"}
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

              
              {isSuperUser && (
                <TabsContent value="admins">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Administrator Accounts ({sortedAdmins.length})
                      </CardTitle>
                      <CardDescription>
                        View and manage all admin user accounts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {sortedAdmins.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No admin accounts found.
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
                            {sortedAdmins.map(user => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    <Shield className="h-3.5 w-3.5 mr-1" />
                                    admin
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
                                  {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "N/A"}
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
              )}

              {/* Add Account Form */}
              <TabsContent value="add">
                <Card>
                  <CardHeader>
                    <CardTitle>Add User Account</CardTitle>
                    <CardDescription>Create a new user account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="johndoe (leave empty to auto-generate)" {...field} />
                              </FormControl>
                              <FormDescription>
                                If left empty, username will be generated as firstname.lastname
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
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
                                <RadioGroup
                                  onValueChange={value => {
                                    // Prevent setting to admin if not allowed
                                    if (!isSuperUser && value === "admin") return;
                                    field.onChange(value);
                                  }}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                  value={field.value}
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="developer" id="role-developer" disabled={false} />
                                    <Label htmlFor="role-developer" className="flex items-center">
                                      <User className="h-4 w-4 mr-2" />
                                      Developer
                                    </Label>
                                  </div>
                                  {/* ONLY SHOW ADMIN OPTION TO SUPERUSERS */}
                                  {isSuperUser && (
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="admin" id="role-admin" disabled={false} />
                                      <Label htmlFor="role-admin" className="flex items-center">
                                        <Shield className="h-4 w-4 mr-2" />
                                        Administrator
                                      </Label>
                                    </div>
                                  )}
                                  {/* If not superuser, no admin role option rendered */}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                              {/* Optionally, let the user know why they can't add admins */}
                              {!isSuperUser && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Only superusers can create admin accounts.
                                </div>
                              )}
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
