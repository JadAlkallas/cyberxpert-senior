
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TestHistoryItem as TestHistoryItemType } from "@/context/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Wrench, FileText } from "lucide-react";
import CircleProgressChart from "../dashboard/CircleProgressChart";
import { toast } from "sonner";

interface TestHistoryItemProps {
  test: TestHistoryItemType;
  showCreator?: boolean;
}

const TestHistoryItem = ({ test, showCreator = false }: TestHistoryItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const [solvingInProgress, setSolvingInProgress] = useState(false);
  
  // Format date
  const formattedDate = new Date(test.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle solving vulnerabilities
  const handleSolveVulnerabilities = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent expanding/collapsing
    
    setSolvingInProgress(true);
    
    // Simulate solving process
    setTimeout(() => {
      setSolvingInProgress(false);
      toast.success("Vulnerabilities analysis complete. Some issues may require manual intervention.");
    }, 2500);
  };
  
  // Handle report generation
  const handleGenerateReport = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent expanding/collapsing
    
    toast.success("Detailed vulnerability report generated");
    
    // Create report content
    const content = `
      Security Test Report: ${test.id}
      Date: ${formattedDate} at ${test.time}
      Status: ${test.status}
      ${test.createdBy ? `Created by: ${test.createdBy.username}` : ''}
      
      Test Duration: ${test.details.duration}
      Components Analyzed: ${test.details.components}
      Vulnerabilities Found: ${test.details.vulnerabilities}
      Security Score: ${test.details.score}/100
      
      Vulnerability Details:
      ${test.details.vulnerabilityDetails?.map(v => 
        `- Type: ${v.type}\n  Description: ${v.description}\n  Status: ${v.status || 'Not addressed'}`
      ).join('\n\n') || 'No detailed vulnerability information available.'}
      
      Mitigation Efforts:
      ${test.details.mitigationApplied ? 'Automatic vulnerability remediation was attempted.' : 'No automatic remediation has been applied.'}
      ${test.details.mitigationSuccess ? 'Some vulnerabilities were successfully mitigated.' : 'Manual intervention recommended for all issues.'}
    `;
    
    // Create a Blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-test-report-${test.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  return (
    <Card className="overflow-hidden">
      <div 
        className={cn(
          "px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-gray-50",
          expanded && "border-b"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="text-sm font-medium">{test.id}</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">
              {formattedDate} at ${test.time}
            </span>
            <span className={cn("text-xs px-2 py-0.5 rounded-full", getStatusColor(test.status))}>
              {test.status}
            </span>
            
            {/* Show creator badge for admins */}
            {showCreator && test.createdBy && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {test.createdBy.username}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {test.status === 'completed' && test.details.vulnerabilities > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSolveVulnerabilities}
              disabled={solvingInProgress}
              className="hidden sm:flex items-center gap-1"
            >
              <Wrench size={16} />
              {solvingInProgress ? 'Solving...' : 'Solve Issues'}
            </Button>
          )}
          
          <Button variant="ghost" size="sm" className="ml-auto">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>
      
      {expanded && (
        <CardContent className="p-4 bg-gray-50 animate-fade-in">
          {/* Basic Test Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {showCreator && test.createdBy && (
              <div className="bg-white rounded-md p-4 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Created By</div>
                <div className="text-lg font-semibold">{test.createdBy.username}</div>
              </div>
            )}
            
            <div className="bg-white rounded-md p-4 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Duration</div>
              <div className="text-lg font-semibold">{test.details.duration}</div>
            </div>
            
            <div className="bg-white rounded-md p-4 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Components Analyzed</div>
              <div className="text-lg font-semibold">{test.details.components}</div>
            </div>
            
            <div className="bg-white rounded-md p-4 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Vulnerabilities</div>
              <div className="text-lg font-semibold">{test.details.vulnerabilities}</div>
            </div>
            
            <div className="bg-white rounded-md p-4 shadow-sm flex justify-center">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Score</div>
                <CircleProgressChart
                  value={test.details.score}
                  size={60}
                  strokeWidth={6}
                />
              </div>
            </div>
          </div>
          
          {/* Vulnerability Details Section */}
          {test.details.vulnerabilities > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Vulnerability Details</h3>
                <div className="flex gap-2">
                  {test.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSolveVulnerabilities}
                      disabled={solvingInProgress}
                      className="sm:hidden flex items-center gap-1"
                    >
                      <Wrench size={16} />
                      {solvingInProgress ? 'Solving...' : 'Solve Issues'}
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateReport}
                    className="flex items-center gap-1"
                  >
                    <FileText size={16} />
                    Generate Report
                  </Button>
                </div>
              </div>
              
              {/* Display vulnerability types and descriptions */}
              <div className="space-y-3">
                {test.details.vulnerabilityDetails?.length ? (
                  test.details.vulnerabilityDetails.map((vulnerability, index) => (
                    <div key={index} className="bg-white p-4 rounded-md border">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              vulnerability.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              vulnerability.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              vulnerability.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            )}>
                              {vulnerability.severity}
                            </span>
                            <h4 className="font-medium">{vulnerability.type}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {vulnerability.description}
                          </p>
                        </div>
                        
                        <div className="text-sm">
                          <span className={cn(
                            "px-2 py-1 rounded-md",
                            vulnerability.status === 'fixed' ? 'bg-green-100 text-green-800' : 
                            vulnerability.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          )}>
                            {vulnerability.status === 'fixed' ? 'Fixed' : 
                             vulnerability.status === 'in_progress' ? 'In Progress' : 
                             'Not Addressed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-4 rounded-md border text-center text-gray-500">
                    No detailed vulnerability information available
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default TestHistoryItem;
