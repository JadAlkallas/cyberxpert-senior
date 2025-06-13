
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserAuthFlowDiagram = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Activity Diagram 1: User Authentication Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <svg viewBox="0 0 600 400" className="w-full h-auto border rounded">
            {/* Start Node */}
            <circle cx="50" cy="50" r="20" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
            <text x="50" y="55" textAnchor="middle" className="text-xs font-medium">Start</text>
            
            {/* Login Form */}
            <rect x="20" y="100" width="60" height="30" fill="#e5e7eb" stroke="#6b7280" strokeWidth="1" rx="5"/>
            <text x="50" y="120" textAnchor="middle" className="text-xs">Login Form</text>
            
            {/* Validation Decision */}
            <polygon points="30,180 70,160 110,180 70,200" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1"/>
            <text x="70" y="185" textAnchor="middle" className="text-xs">Valid?</text>
            
            {/* Success Path */}
            <rect x="150" y="165" width="80" height="30" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" rx="5"/>
            <text x="190" y="185" textAnchor="middle" className="text-xs">Generate Token</text>
            
            {/* Dashboard */}
            <rect x="280" y="165" width="80" height="30" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" rx="5"/>
            <text x="320" y="185" textAnchor="middle" className="text-xs">Dashboard</text>
            
            {/* Error Path */}
            <rect x="40" y="250" width="80" height="30" fill="#fecaca" stroke="#dc2626" strokeWidth="1" rx="5"/>
            <text x="80" y="270" textAnchor="middle" className="text-xs">Show Error</text>
            
            {/* End Node */}
            <circle cx="320" cy="320" r="20" fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
            <text x="320" y="325" textAnchor="middle" className="text-xs font-medium">End</text>
            
            {/* Arrows */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
               refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
              </marker>
            </defs>
            
            <line x1="50" y1="70" x2="50" y2="100" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrowhead)"/>
            <line x1="50" y1="130" x2="70" y2="160" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrowhead)"/>
            <line x1="110" y1="180" x2="150" y2="180" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrowhead)"/>
            <line x1="230" y1="180" x2="280" y2="180" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrowhead)"/>
            <line x1="320" y1="195" x2="320" y2="300" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrowhead)"/>
            <line x1="70" y1="200" x2="80" y2="250" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrowhead)"/>
            <line x1="80" y1="280" x2="50" y2="310" stroke="#6b7280" strokeWidth="1"/>
            <line x1="50" y1="310" x2="50" y2="120" stroke="#6b7280" strokeWidth="1" strokeDasharray="5,5"/>
            
            {/* Labels */}
            <text x="125" y="175" className="text-xs fill-green-600">Yes</text>
            <text x="75" y="225" className="text-xs fill-red-600">No</text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAuthFlowDiagram;
