
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SecurityAnalysisDiagram = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Activity Diagram 2: Security Analysis Process</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <svg viewBox="0 0 700 450" className="w-full h-auto border rounded">
            {/* Start Node */}
            <circle cx="50" cy="40" r="15" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
            <text x="50" y="45" textAnchor="middle" className="text-xs font-medium">Start</text>
            
            {/* Initialize Scan */}
            <rect x="20" y="80" width="60" height="25" fill="#e5e7eb" stroke="#6b7280" strokeWidth="1" rx="3"/>
            <text x="50" y="97" textAnchor="middle" className="text-xs">Initialize</text>
            
            {/* Network Topology */}
            <rect x="20" y="130" width="60" height="25" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" rx="3"/>
            <text x="50" y="147" textAnchor="middle" className="text-xs">Network Scan</text>
            
            {/* Port Analysis */}
            <rect x="120" y="130" width="60" height="25" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" rx="3"/>
            <text x="150" y="147" textAnchor="middle" className="text-xs">Port Analysis</text>
            
            {/* Vulnerability Check */}
            <rect x="220" y="130" width="80" height="25" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" rx="3"/>
            <text x="260" y="147" textAnchor="middle" className="text-xs">Vuln Detection</text>
            
            {/* Auth Test */}
            <rect x="340" y="130" width="80" height="25" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" rx="3"/>
            <text x="380" y="147" textAnchor="middle" className="text-xs">Auth Testing</text>
            
            {/* Encryption Analysis */}
            <rect x="460" y="130" width="80" height="25" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" rx="3"/>
            <text x="500" y="147" textAnchor="middle" className="text-xs">Encryption</text>
            
            {/* Compile Results */}
            <rect x="220" y="200" width="80" height="25" fill="#f3e8ff" stroke="#8b5cf6" strokeWidth="1" rx="3"/>
            <text x="260" y="217" textAnchor="middle" className="text-xs">Compile Results</text>
            
            {/* Generate Report */}
            <rect x="220" y="250" width="80" height="25" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" rx="3"/>
            <text x="260" y="267" textAnchor="middle" className="text-xs">Generate Report</text>
            
            {/* Decision: Critical Issues? */}
            <polygon points="240,310 280,290 320,310 280,330" fill="#fecaca" stroke="#dc2626" strokeWidth="1"/>
            <text x="280" y="315" textAnchor="middle" className="text-xs">Critical?</text>
            
            {/* Alert Admin */}
            <rect x="380" y="295" width="80" height="25" fill="#fecaca" stroke="#dc2626" strokeWidth="1" rx="3"/>
            <text x="420" y="312" textAnchor="middle" className="text-xs">Alert Admin</text>
            
            {/* Store Results */}
            <rect x="220" y="370" width="80" height="25" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" rx="3"/>
            <text x="260" y="387" textAnchor="middle" className="text-xs">Store Results</text>
            
            {/* End Node */}
            <circle cx="260" cy="420" r="15" fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
            <text x="260" y="425" textAnchor="middle" className="text-xs font-medium">End</text>
            
            {/* Arrows */}
            <defs>
              <marker id="arrow2" markerWidth="8" markerHeight="6" 
               refX="0" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#6b7280" />
              </marker>
            </defs>
            
            {/* Vertical flow */}
            <line x1="50" y1="55" x2="50" y2="80" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow2)"/>
            <line x1="50" y1="105" x2="50" y2="130" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow2)"/>
            
            {/* Horizontal analysis flow */}
            <line x1="80" y1="142" x2="120" y2="142" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow2)"/>
            <line x1="180" y1="142" x2="220" y2="142" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow2)"/>
            <line x1="300" y1="142" x2="340" y2="142" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow2)"/>
            <line x1="420" y1="142" x2="460" y2="142" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow2)"/>
            
            {/* Compilation flow */}
            <line x1="260" y1="155" x2="260" y2="200" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow2)"/>
            <line x1="260" y1="225" x2="260" y2="250" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow2)"/>
            <line x1="260" y1="275" x2="280" y2="290" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow2)"/>
            
            {/* Critical path */}
            <line x1="320" y1="310" x2="380" y2="310" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow2)"/>
            <line x1="420" y1="320" x2="420" y2="350" stroke="#6b7280" strokeWidth="1"/>
            <line x1="420" y1="350" x2="260" y2="350" stroke="#6b7280" strokeWidth="1"/>
            <line x1="260" y1="350" x2="260" y2="370" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow2)"/>
            
            {/* Non-critical path */}
            <line x1="280" y1="330" x2="260" y2="370" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow2)"/>
            
            {/* Final flow */}
            <line x1="260" y1="395" x2="260" y2="405" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow2)"/>
            
            {/* Labels */}
            <text x="340" y="305" className="text-xs fill-red-600">Yes</text>
            <text x="250" y="350" className="text-xs fill-green-600">No</text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAnalysisDiagram;
