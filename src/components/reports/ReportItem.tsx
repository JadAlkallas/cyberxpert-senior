
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ReportItem as ReportItemType } from "@/context/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import CircleProgressChart from "../dashboard/CircleProgressChart";

interface ReportItemProps {
  report: ReportItemType;
  showCreator?: boolean;
}

const ReportItem = ({ report, showCreator = false }: ReportItemProps) => {
  const [expanded, setExpanded] = useState(false);
  
  // Format date
  const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Handle PDF download
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent expanding/collapsing when clicking download
    
    // Create content for PDF
    const content = `
      Security Report: ${report.id}
      Date: ${formattedDate} at ${report.time}
      ${report.createdBy ? `Created by: ${report.createdBy.username}` : ''}
      
      Security Score: ${report.securityPosture.score}/100
      
      Issues:
      - Critical: ${report.securityPosture.criticalIssues}
      - High: ${report.securityPosture.highIssues}
      - Medium: ${report.securityPosture.mediumIssues}
      - Low: ${report.securityPosture.lowIssues}
      
      Details:
      ${report.securityPosture.details}
    `;
    
    // Create a Blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-report-${report.id}.pdf`;
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
          <span className="text-sm font-medium">{report.id}</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">
              {formattedDate} at {report.time}
            </span>
            
            {/* Show creator badge for admins */}
            {showCreator && report.createdBy && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {report.createdBy.username}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            className="hidden sm:flex items-center gap-1"
          >
            <Download size={16} />
            PDF
          </Button>
          
          <div className="hidden sm:block">
            <CircleProgressChart
              value={report.securityPosture.score}
              size={40}
              strokeWidth={4}
              animate={false}
            />
          </div>
          
          <Button variant="ghost" size="sm">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>
      
      {expanded && (
        <CardContent className="p-4 bg-gray-50 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 flex justify-center">
              <CircleProgressChart
                value={report.securityPosture.score}
                size={120}
                title="Security Score"
                description="Overall security rating"
              />
            </div>
            
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Security Issues</h3>
                  {showCreator && report.createdBy && (
                    <p className="text-sm text-gray-600">Created by: {report.createdBy.username}</p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownload}
                  className="sm:hidden flex items-center gap-1"
                >
                  <Download size={16} />
                  PDF
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-red-50 text-red-900 p-3 rounded-md">
                  <div className="text-xs opacity-80">Critical</div>
                  <div className="text-xl font-bold">{report.securityPosture.criticalIssues}</div>
                </div>
                <div className="bg-orange-50 text-orange-900 p-3 rounded-md">
                  <div className="text-xs opacity-80">High</div>
                  <div className="text-xl font-bold">{report.securityPosture.highIssues}</div>
                </div>
                <div className="bg-yellow-50 text-yellow-900 p-3 rounded-md">
                  <div className="text-xs opacity-80">Medium</div>
                  <div className="text-xl font-bold">{report.securityPosture.mediumIssues}</div>
                </div>
                <div className="bg-blue-50 text-blue-900 p-3 rounded-md">
                  <div className="text-xs opacity-80">Low</div>
                  <div className="text-xl font-bold">{report.securityPosture.lowIssues}</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Details</h4>
                <p className="text-sm text-gray-700 bg-white p-3 border rounded-md">
                  {report.securityPosture.details}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ReportItem;
