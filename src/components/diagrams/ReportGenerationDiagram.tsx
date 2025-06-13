
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReportGenerationDiagram = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Activity Diagram 4: Report Generation Process</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <svg viewBox="0 0 600 450" className="w-full h-auto border rounded">
            {/* Start Node */}
            <circle cx="50" cy="40" r="15" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
            <text x="50" y="45" textAnchor="middle" className="text-xs font-medium">Start</text>
            
            {/* Collect Analysis Data */}
            <rect x="20" y="80" width="60" height="25" fill="#e5e7eb" stroke="#6b7280" strokeWidth="1" rx="3"/>
            <text x="50" y="97" textAnchor="middle" className="text-xs">Collect Data</text>
            
            {/* Format Vulnerabilities */}
            <rect x="20" y="130" width="60" height="25" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" rx="3"/>
            <text x="50" y="147" textAnchor="middle" className="text-xs">Format Vulns</text>
            
            {/* Generate IDs */}
            <rect x="120" y="130" width="60" height="25" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" rx="3"/>
            <text x="150" y="147" textAnchor="middle" className="text-xs">Generate IDs</text>
            
            {/* Add TTS Info */}
            <rect x="220" y="130" width="80" height="25" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" rx="3"/>
            <text x="260" y="147" textAnchor="middle" className="text-xs">Add TTS Info</text>
            
            {/* Create Executive Summary */}
            <rect x="350" y="130" width="100" height="25" fill="#f3e8ff" stroke="#8b5cf6" strokeWidth="1" rx="3"/>
            <text x="400" y="147" textAnchor="middle" className="text-xs">Executive Summary</text>
            
            {/* Add Activity Diagrams */}
            <rect x="180" y="180" width="100" height="25" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" rx="3"/>
            <text x="230" y="197" textAnchor="middle" className="text-xs">Add Diagrams</text>
            
            {/* Format Report */}
            <rect x="200" y="230" width="80" height="25" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" rx="3"/>
            <text x="240" y="247" textAnchor="middle" className="text-xs">Format Report</text>
            
            {/* Decision: Include Charts? */}
            <polygon points="220,280 260,260 300,280 260,300" fill="#fecaca" stroke="#dc2626" strokeWidth="1"/>
            <text x="260" y="285" textAnchor="middle" className="text-xs">Charts?</text>
            
            {/* Generate Charts */}
            <rect x="350" y="265" width="80" height="25" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" rx="3"/>
            <text x="390" y="282" textAnchor="middle" className="text-xs">Gen Charts</text>
            
            {/* Save to Database */}
            <rect x="200" y="330" width="80" height="25" fill="#f3e8ff" stroke="#8b5cf6" strokeWidth="1" rx="3"/>
            <text x="240" y="347" textAnchor="middle" className="text-xs">Save to DB</text>
            
            {/* Generate Download */}
            <rect x="200" y="380" width="80" height="25" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" rx="3"/>
            <text x="240" y="397" textAnchor="middle" className="text-xs">Gen Download</text>
            
            {/* End Node */}
            <circle cx="240" cy="420" r="15" fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
            <text x="240" y="425" textAnchor="middle" className="text-xs font-medium">End</text>
            
            {/* Arrows */}
            <defs>
              <marker id="arrow4" markerWidth="8" markerHeight="6" 
               refX="0" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#6b7280" />
              </marker>
            </defs>
            
            {/* Main vertical flow */}
            <line x1="50" y1="55" x2="50" y2="80" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow4)"/>
            <line x1="50" y1="105" x2="50" y2="130" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow4)"/>
            
            {/* Horizontal processing flow */}
            <line x1="80" y1="142" x2="120" y2="142" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow4)"/>
            <line x1="180" y1="142" x2="220" y2="142" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow4)"/>
            <line x1="300" y1="142" x2="350" y2="142" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow4)"/>
            
            {/* Convergence to diagram addition */}
            <line x1="260" y1="155" x2="230" y2="180" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow4)"/>
            <line x1="400" y1="155" x2="280" y2="180" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow4)"/>
            
            {/* Continue flow */}
            <line x1="230" y1="205" x2="240" y2="230" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow4)"/>
            <line x1="240" y1="255" x2="260" y2="260" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow4)"/>
            
            {/* Charts decision */}
            <line x1="300" y1="280" x2="350" y2="280" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow4)"/>
            <line x1="390" y1="290" x2="390" y2="310" stroke="#6b7280" strokeWidth="1"/>
            <line x1="390" y1="310" x2="240" y2="310" stroke="#6b7280" strokeWidth="1"/>
            <line x1="240" y1="310" x2="240" y2="330" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow4)"/>
            
            {/* No charts path */}
            <line x1="260" y1="300" x2="240" y2="330" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow4)"/>
            
            {/* Final steps */}
            <line x1="240" y1="355" x2="240" y2="380" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow4)"/>
            <line x1="240" y1="405" x2="240" y2="405" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow4)"/>
            
            {/* Labels */}
            <text x="315" y="275" className="text-xs fill-green-600">Yes</text>
            <text x="250" y="315" className="text-xs fill-gray-600">No</text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerationDiagram;
