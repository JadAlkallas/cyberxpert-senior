
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MitigationFlowDiagram = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Activity Diagram 5: Mitigation Implementation Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <svg viewBox="0 0 700 500" className="w-full h-auto border rounded">
            {/* Start Node */}
            <circle cx="50" cy="40" r="15" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
            <text x="50" y="45" textAnchor="middle" className="text-xs font-medium">Start</text>
            
            {/* Load Vulnerabilities */}
            <rect x="20" y="80" width="60" height="25" fill="#e5e7eb" stroke="#6b7280" strokeWidth="1" rx="3"/>
            <text x="50" y="97" textAnchor="middle" className="text-xs">Load Vulns</text>
            
            {/* Prioritize by Severity */}
            <rect x="20" y="130" width="80" height="25" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" rx="3"/>
            <text x="60" y="147" textAnchor="middle" className="text-xs">Prioritize</text>
            
            {/* Decision: Auto-fixable? */}
            <polygon points="40,180 80,160 120,180 80,200" fill="#fecaca" stroke="#dc2626" strokeWidth="1"/>
            <text x="80" y="185" textAnchor="middle" className="text-xs">Auto-fix?</text>
            
            {/* Automatic Fixes */}
            <rect x="180" y="120" width="80" height="25" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" rx="3"/>
            <text x="220" y="137" textAnchor="middle" className="text-xs">Auto Patch</text>
            
            {/* Code Updates */}
            <rect x="300" y="120" width="80" height="25" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" rx="3"/>
            <text x="340" y="137" textAnchor="middle" className="text-xs">Code Update</text>
            
            {/* Config Changes */}
            <rect x="420" y="120" width="80" height="25" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" rx="3"/>
            <text x="460" y="137" textAnchor="middle" className="text-xs">Config Fix</text>
            
            {/* Manual Review Required */}
            <rect x="160" y="210" width="100" height="25" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" rx="3"/>
            <text x="210" y="227" textAnchor="middle" className="text-xs">Manual Review</text>
            
            {/* Admin Notification */}
            <rect x="300" y="210" width="80" height="25" fill="#fecaca" stroke="#dc2626" strokeWidth="1" rx="3"/>
            <text x="340" y="227" textAnchor="middle" className="text-xs">Notify Admin</text>
            
            {/* Test Fixes */}
            <rect x="280" y="270" width="80" height="25" fill="#f3e8ff" stroke="#8b5cf6" strokeWidth="1" rx="3"/>
            <text x="320" y="287" textAnchor="middle" className="text-xs">Test Fixes</text>
            
            {/* Decision: Tests Pass? */}
            <polygon points="300,320 340,300 380,320 340,340" fill="#fecaca" stroke="#dc2626" strokeWidth="1"/>
            <text x="340" y="325" textAnchor="middle" className="text-xs">Pass?</text>
            
            {/* Deploy Changes */}
            <rect x="450" y="305" width="80" height="25" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" rx="3"/>
            <text x="490" y="322" textAnchor="middle" className="text-xs">Deploy</text>
            
            {/* Rollback */}
            <rect x="200" y="370" width="80" height="25" fill="#fecaca" stroke="#dc2626" strokeWidth="1" rx="3"/>
            <text x="240" y="387" textAnchor="middle" className="text-xs">Rollback</text>
            
            {/* Update Status */}
            <rect x="400" y="370" width="80" height="25" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" rx="3"/>
            <text x="440" y="387" textAnchor="middle" className="text-xs">Update Status</text>
            
            {/* Verify Fix */}
            <rect x="520" y="370" width="80" height="25" fill="#f3e8ff" stroke="#8b5cf6" strokeWidth="1" rx="3"/>
            <text x="560" y="387" textAnchor="middle" className="text-xs">Verify Fix</text>
            
            {/* End Node */}
            <circle cx="440" cy="430" r="15" fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
            <text x="440" y="435" textAnchor="middle" className="text-xs font-medium">End</text>
            
            {/* Arrows */}
            <defs>
              <marker id="arrow5" markerWidth="8" markerHeight="6" 
               refX="0" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#6b7280" />
              </marker>
            </defs>
            
            {/* Main flow */}
            <line x1="50" y1="55" x2="50" y2="80" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            <line x1="50" y1="105" x2="60" y2="130" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            <line x1="80" y1="155" x2="80" y2="160" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            
            {/* Auto-fix path */}
            <line x1="120" y1="180" x2="180" y2="132" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            <line x1="260" y1="132" x2="300" y2="132" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            <line x1="380" y1="132" x2="420" y2="132" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            
            {/* Manual path */}
            <line x1="80" y1="200" x2="160" y2="222" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            <line x1="260" y1="222" x2="300" y2="222" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            
            {/* Convergence to testing */}
            <line x1="340" y1="145" x2="320" y2="270" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            <line x1="340" y1="235" x2="320" y2="270" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            
            {/* Test decision */}
            <line x1="320" y1="295" x2="340" y2="300" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            
            {/* Success path */}
            <line x1="380" y1="320" x2="450" y2="320" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            <line x1="490" y1="330" x2="440" y2="370" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            <line x1="480" y1="387" x2="520" y2="387" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            <line x1="560" y1="395" x2="560" y2="410" stroke="#6b7280" strokeWidth="1"/>
            <line x1="560" y1="410" x2="440" y2="410" stroke="#6b7280" strokeWidth="1"/>
            <line x1="440" y1="410" x2="440" y2="415" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            
            {/* Failure path */}
            <line x1="340" y1="340" x2="240" y2="370" stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow5)"/>
            <line x1="240" y1="395" x2="240" y2="410" stroke="#6b7280" strokeWidth="1"/>
            <line x1="240" y1="410" x2="80" y2="410" stroke="#6b7280" strokeWidth="1"/>
            <line x1="80" y1="410" x2="80" y2="180" stroke="#6b7280" strokeWidth="1" strokeDasharray="5,5" markerEnd="url(#arrow5)"/>
            
            {/* Labels */}
            <text x="130" y="150" className="text-xs fill-green-600">Yes</text>
            <text x="120" y="205" className="text-xs fill-orange-600">No</text>
            <text x="395" y="315" className="text-xs fill-green-600">Yes</text>
            <text x="285" y="355" className="text-xs fill-red-600">No</text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default MitigationFlowDiagram;
