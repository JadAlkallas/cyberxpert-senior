
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReportItem from "@/components/reports/ReportItem";
import { FileText, Loader, RefreshCw } from "lucide-react";
import { useState } from "react";

const Reports = () => {
  const { user } = useAuth();
  const { reports, refreshData } = useData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filter reports based on user role
  const userReports = user?.role === "admin" 
    ? reports 
    : reports.filter(report => report.createdBy?.id === user?.id);
  
  const unreadCount = userReports.filter(report => !report.read).length;
  
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
                <FileText className="h-8 w-8 text-cyber-orange" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Security Reports</h1>
                  <p className="text-gray-600">Comprehensive security analysis reports</p>
                </div>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} new
                  </Badge>
                )}
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
            
            {/* Reports List */}
            {userReports.length > 0 ? (
              <div className="space-y-4">
                {userReports.map((report) => (
                  <ReportItem key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Reports Available</CardTitle>
                  <CardDescription>
                    No security reports have been generated yet. Run security analyses to generate reports.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Security reports will appear here once you run security analyses.
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

export default Reports;
