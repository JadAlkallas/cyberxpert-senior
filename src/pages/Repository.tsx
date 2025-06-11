
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TestHistoryItem from "@/components/repository/TestHistoryItem";
import { Database, Loader, RefreshCw } from "lucide-react";
import { useState } from "react";

const Repository = () => {
  const { user } = useAuth();
  const { testHistory, refreshData } = useData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filter test history based on user role
  const userTests = user?.role === "admin" 
    ? testHistory 
    : testHistory.filter(test => test.createdBy?.id === user?.id);
  
  const completedTests = userTests.filter(test => test.status === "completed").length;
  const failedTests = userTests.filter(test => test.status === "failed").length;
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshData();
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-cyber-orange" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Test Repository</h1>
                  <p className="text-gray-600">Security test history and results</p>
                </div>
              </div>
              
              <Button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
              >
                {isRefreshing ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Total Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userTests.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{completedTests}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Failed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{failedTests}</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Test History */}
            {userTests.length > 0 ? (
              <div className="space-y-4">
                {userTests.map((test) => (
                  <TestHistoryItem key={test.id} test={test} />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Tests Available</CardTitle>
                  <CardDescription>
                    No security tests have been run yet. Start a security analysis to see results here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Your security test history will appear here once you run analyses.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Repository;
