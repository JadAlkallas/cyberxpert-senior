
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useData } from "@/context/DataContext";
import ReportItem from "@/components/reports/ReportItem";
import { Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Reports = () => {
  const { getUserVisibleReports } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReports, setFilteredReports] = useState(getUserVisibleReports());
  const [showNewAnimation, setShowNewAnimation] = useState(false);
  
  const isAdmin = user?.role === "Admin";
  const reports = getUserVisibleReports();
  
  // Filter reports based on search term
  useEffect(() => {
    const filtered = reports.filter(report =>
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (isAdmin && report.createdBy?.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredReports(filtered);
  }, [searchTerm, reports, isAdmin]);
  
  // Detect new reports and show animation
  useEffect(() => {
    if (reports.length > 0) {
      setShowNewAnimation(true);
      const timer = setTimeout(() => {
        setShowNewAnimation(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [reports.length]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 bg-gray-50 p-6">
          <div className="container mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Security Reports</h1>
                <p className="text-gray-600">View detailed security posture reports</p>
              </div>
              
              {showNewAnimation && (
                <div className="mt-4 md:mt-0 px-4 py-2 bg-cyber-orange text-white rounded-md animate-pulse-glow">
                  New report added!
                </div>
              )}
            </div>
            
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={isAdmin ? "Search reports by ID or username..." : "Search reports by ID..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <div key={report.id} className={index === 0 && showNewAnimation ? "animate-pulse-glow" : ""}>
                    <ReportItem report={report} showCreator={isAdmin} />
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg p-8 text-center border">
                  <div className="text-gray-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  
                  {reports.length === 0 ? (
                    <>
                      <h3 className="text-xl font-medium mb-1">No reports found</h3>
                      <p className="text-gray-500">
                        Start an analysis to generate security posture reports.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-medium mb-1">No matching reports</h3>
                      <p className="text-gray-500">
                        Try adjusting your search term.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
