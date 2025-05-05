
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TestHistoryItem as TestHistoryItemType } from "@/context/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import CircleProgressChart from "../dashboard/CircleProgressChart";

interface TestHistoryItemProps {
  test: TestHistoryItemType;
}

const TestHistoryItem = ({ test }: TestHistoryItemProps) => {
  const [expanded, setExpanded] = useState(false);
  
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
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {formattedDate} at {test.time}
            </span>
            <span className={cn("text-xs px-2 py-0.5 rounded-full", getStatusColor(test.status))}>
              {test.status}
            </span>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="ml-auto">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>
      
      {expanded && (
        <CardContent className="p-4 bg-gray-50 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        </CardContent>
      )}
    </Card>
  );
};

export default TestHistoryItem;
