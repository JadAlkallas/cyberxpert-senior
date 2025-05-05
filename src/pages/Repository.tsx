
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useData } from "@/context/DataContext";
import TestHistoryItem from "@/components/repository/TestHistoryItem";
import { Search } from "lucide-react";

const Repository = () => {
  const { testHistory } = useData();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Filter and search test history
  const filteredTests = testHistory.filter(test => {
    // Filter by status
    if (filterStatus !== "all" && test.status !== filterStatus) {
      return false;
    }
    
    // Search by ID
    if (searchTerm && !test.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 bg-gray-50 p-6">
          <div className="container mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Test Repository</h1>
              <p className="text-gray-600">View and manage all your security test results</p>
            </div>
            
            {/* Filters and Search */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by test ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="w-full sm:w-64">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Test History List */}
            <div className="space-y-4">
              {filteredTests.length > 0 ? (
                filteredTests.map((test) => (
                  <TestHistoryItem key={test.id} test={test} />
                ))
              ) : (
                <div className="bg-white rounded-lg p-8 text-center border">
                  <div className="text-gray-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  
                  {testHistory.length === 0 ? (
                    <>
                      <h3 className="text-xl font-medium mb-1">No tests found</h3>
                      <p className="text-gray-500">
                        Start an analysis to see your test results here.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-medium mb-1">No matching tests</h3>
                      <p className="text-gray-500">
                        Try adjusting your search or filters.
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

export default Repository;
