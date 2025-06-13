
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import UserAuthFlowDiagram from "@/components/diagrams/UserAuthFlowDiagram";
import SecurityAnalysisDiagram from "@/components/diagrams/SecurityAnalysisDiagram";
import VulnerabilityDetectionDiagram from "@/components/diagrams/VulnerabilityDetectionDiagram";
import ReportGenerationDiagram from "@/components/diagrams/ReportGenerationDiagram";
import MitigationFlowDiagram from "@/components/diagrams/MitigationFlowDiagram";

const ActivityDiagrams = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-cyber-orange" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Activity Diagrams</h1>
                <p className="text-gray-600">Security process workflows and system activities</p>
              </div>
            </div>
            
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Security Platform Activity Diagrams</CardTitle>
                <CardDescription>
                  These activity diagrams illustrate the key workflows and processes within the CyberXpert security platform,
                  showing how different security features interact and operate to provide comprehensive protection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-900">Authentication Flow</h4>
                    <p className="text-blue-700">User login and access control processes</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-md">
                    <h4 className="font-medium text-green-900">Security Analysis</h4>
                    <p className="text-green-700">Comprehensive security scanning workflow</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-md">
                    <h4 className="font-medium text-yellow-900">Vulnerability Detection</h4>
                    <p className="text-yellow-700">Automated vulnerability discovery process</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-md">
                    <h4 className="font-medium text-purple-900">Report Generation</h4>
                    <p className="text-purple-700">Security report creation and formatting</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-md">
                    <h4 className="font-medium text-red-900">Mitigation Flow</h4>
                    <p className="text-red-700">Vulnerability remediation workflow</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Activity Diagrams */}
            <div className="space-y-8">
              <UserAuthFlowDiagram />
              <SecurityAnalysisDiagram />
              <VulnerabilityDetectionDiagram />
              <ReportGenerationDiagram />
              <MitigationFlowDiagram />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActivityDiagrams;
