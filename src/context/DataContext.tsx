
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User } from "@/context/AuthContext";

export interface VulnerabilityDetail {
  component: string;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  description: string;
  solution: string;
  cveId?: string;
  status?: "fixed" | "in_progress" | "not_addressed";
}

export interface TestHistoryItem {
  id: string;
  date: string;
  time: string;
  status: "completed" | "failed" | "pending";
  createdBy?: {
    id: string;
    username: string;
  };
  details: {
    duration: string;
    components: number;
    vulnerabilities: number;
    score: number;
    vulnerabilityDetails?: VulnerabilityDetail[];
    mitigationApplied?: boolean;
    mitigationSuccess?: boolean;
  };
}

export interface ReportItem {
  id: string;
  date: string;
  time: string;
  read: boolean;
  createdBy?: {
    id: string;
    username: string;
  };
  securityPosture: {
    score: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
    details: string;
  };
}

export interface AnalyticsData {
  score: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  testsRun: number;
  lastScan: string;
  trend: "up" | "down" | "stable";
  monthlyData: Array<{
    month: string;
    score: number;
    vulnerabilities: number;
  }>;
  // Add properties that are expected by components
  averageScore: number;
  totalTests: number;
  criticalIssues: number;
  resolvedIssues: number;
  testsOverTime: Array<{
    date: string;
    count: number;
  }>;
  scoreDistribution: Array<{
    range: string;
    count: number;
  }>;
  vulnerabilityCategories: Array<{
    category: string;
    count: number;
  }>;
}

interface DataContextType {
  testHistory: TestHistoryItem[];
  reports: ReportItem[];
  analytics: AnalyticsData;
  analyticsData: AnalyticsData;
  isAnalyzing: boolean;
  isLoading: boolean;
  currentAnalysis: {
    progress: number;
    status: string;
    testId?: string;
  } | null;
  startAnalysis: () => Promise<boolean>;
  addTestResult: (result: TestHistoryItem) => void;
  addReport: (report: ReportItem) => void;
  markReportAsRead: (reportId: string) => void;
  deleteTest: (testId: string) => void;
  solveVulnerabilities: (testId: string) => Promise<boolean>;
  generateDetailedReport: (testId: string) => Promise<boolean>;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// Utility function to generate random vulnerabilities
const generateRandomVulnerabilities = (): VulnerabilityDetail[] => {
  const severities: ("Critical" | "High" | "Medium" | "Low")[] = ["Critical", "High", "Medium", "Low"];
  const statuses: ("fixed" | "in_progress" | "not_addressed")[] = ["fixed", "in_progress", "not_addressed"];
  const components = ["Auth Module", "Payment Gateway", "Data Storage", "API Endpoint"];
  const types = ["XSS", "SQL Injection", "CSRF", "Authentication Bypass"];

  return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
    component: components[Math.floor(Math.random() * components.length)],
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    description: "A randomly generated vulnerability description.",
    solution: "Implement the suggested fix to mitigate this vulnerability.",
    cveId: `CVE-${Math.floor(Math.random() * 9999)}-${Math.floor(Math.random() * 99999)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }));
};

// Mock data for initial states
const mockTestHistory: TestHistoryItem[] = [
  {
    id: "test-1",
    date: "2024-01-20",
    time: "14:30",
    status: "completed",
    details: {
      duration: "25 minutes",
      components: 32,
      vulnerabilities: 8,
      score: 85,
      vulnerabilityDetails: generateRandomVulnerabilities()
    }
  },
  {
    id: "test-2",
    date: "2024-01-15",
    time: "09:15",
    status: "failed",
    details: {
      duration: "18 minutes",
      components: 25,
      vulnerabilities: 15,
      score: 60,
      vulnerabilityDetails: generateRandomVulnerabilities()
    }
  }
];

const mockReports: ReportItem[] = [
  {
    id: "report-1",
    date: "2024-01-22",
    time: "10:00",
    read: false,
    securityPosture: {
      score: 88,
      criticalIssues: 1,
      highIssues: 2,
      mediumIssues: 3,
      lowIssues: 2,
      details: "Overall good security posture with minor issues to address."
    }
  },
  {
    id: "report-2",
    date: "2024-01-18",
    time: "16:45",
    read: true,
    securityPosture: {
      score: 72,
      criticalIssues: 0,
      highIssues: 3,
      mediumIssues: 5,
      lowIssues: 4,
      details: "Requires attention to medium and high severity vulnerabilities."
    }
  }
];

const mockAnalytics: AnalyticsData = {
  score: 82,
  vulnerabilities: {
    critical: 2,
    high: 5,
    medium: 8,
    low: 6
  },
  testsRun: 15,
  lastScan: "2024-01-25T14:00:00Z",
  trend: "up",
  monthlyData: [
    { month: "Jan", score: 78, vulnerabilities: 21 },
    { month: "Feb", score: 82, vulnerabilities: 18 },
    { month: "Mar", score: 85, vulnerabilities: 15 }
  ],
  averageScore: 82,
  totalTests: 15,
  criticalIssues: 2,
  resolvedIssues: 8,
  testsOverTime: [
    { date: "2024-01-01", count: 5 },
    { date: "2024-01-15", count: 8 },
    { date: "2024-01-30", count: 2 }
  ],
  scoreDistribution: [
    { range: "90-100", count: 3 },
    { range: "80-89", count: 7 },
    { range: "70-79", count: 4 },
    { range: "60-69", count: 1 }
  ],
  vulnerabilityCategories: [
    { category: "Authentication", count: 5 },
    { category: "Input Validation", count: 8 },
    { category: "Authorization", count: 3 },
    { category: "Data Exposure", count: 5 }
  ]
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [testHistory, setTestHistory] = useState<TestHistoryItem[]>(() => {
    const saved = localStorage.getItem("cyberxpert-test-history");
    return saved ? JSON.parse(saved) : mockTestHistory;
  });
  
  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem("cyberxpert-reports");
    return saved ? JSON.parse(saved) : mockReports;
  });
  
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => {
    const saved = localStorage.getItem("cyberxpert-analytics");
    return saved ? JSON.parse(saved) : mockAnalytics;
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    progress: number;
    status: string;
    testId?: string;
  } | null>(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("cyberxpert-test-history", JSON.stringify(testHistory));
  }, [testHistory]);

  useEffect(() => {
    localStorage.setItem("cyberxpert-reports", JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem("cyberxpert-analytics", JSON.stringify(analytics));
  }, [analytics]);

  const startAnalysis = async (): Promise<boolean> => {
    setIsAnalyzing(true);
    setCurrentAnalysis({
      progress: 0,
      status: "Initializing security scan..."
    });

    const steps = [
      "Scanning network topology...",
      "Analyzing open ports...",
      "Checking for known vulnerabilities...",
      "Testing authentication mechanisms...",
      "Evaluating encryption protocols...",
      "Generating security report..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentAnalysis({
        progress: ((i + 1) / steps.length) * 100,
        status: steps[i]
      });
    }

    // Generate a new test result
    const newTest: TestHistoryItem = {
      id: `test-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: "completed",
      details: {
        duration: `${Math.floor(Math.random() * 30) + 10} minutes`,
        components: Math.floor(Math.random() * 50) + 20,
        vulnerabilities: Math.floor(Math.random() * 15) + 5,
        score: Math.floor(Math.random() * 30) + 70,
        vulnerabilityDetails: generateRandomVulnerabilities()
      }
    };

    // Get current user and add to test
    const currentUser = localStorage.getItem("cyberxpert-user");
    if (currentUser) {
      const user: User = JSON.parse(currentUser);
      newTest.createdBy = {
        id: user.id,
        username: user.username
      };
    }

    addTestResult(newTest);
    setCurrentAnalysis(prev => prev ? { ...prev, testId: newTest.id } : null);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAnalyzing(false);
    setCurrentAnalysis(null);
    
    return true;
  };

  const addTestResult = (result: TestHistoryItem) => {
    setTestHistory(prev => [result, ...prev]);
    
    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      testsRun: prev.testsRun + 1,
      totalTests: prev.totalTests + 1,
      lastScan: new Date().toISOString(),
      score: result.details.score,
      averageScore: Math.round((prev.averageScore * prev.totalTests + result.details.score) / (prev.totalTests + 1)),
      vulnerabilities: {
        critical: prev.vulnerabilities.critical + (result.details.vulnerabilityDetails?.filter(v => v.severity === "Critical").length || 0),
        high: prev.vulnerabilities.high + (result.details.vulnerabilityDetails?.filter(v => v.severity === "High").length || 0),
        medium: prev.vulnerabilities.medium + (result.details.vulnerabilityDetails?.filter(v => v.severity === "Medium").length || 0),
        low: prev.vulnerabilities.low + (result.details.vulnerabilityDetails?.filter(v => v.severity === "Low").length || 0),
      },
      criticalIssues: prev.vulnerabilities.critical + (result.details.vulnerabilityDetails?.filter(v => v.severity === "Critical").length || 0)
    }));
  };

  const addReport = (report: ReportItem) => {
    setReports(prev => [report, ...prev]);
  };

  const markReportAsRead = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, read: true } : report
    ));
  };

  const deleteTest = (testId: string) => {
    // Get current user
    const currentUser = localStorage.getItem("cyberxpert-user");
    if (!currentUser) return;
    
    const user: User = JSON.parse(currentUser);
    
    setTestHistory(prev => {
      const testToDelete = prev.find(test => test.id === testId);
      
      // Only allow deletion if user is admin or if they created the test
      if (user.role === "admin" || (testToDelete?.createdBy?.id === user.id)) {
        return prev.filter(test => test.id !== testId);
      }
      
      return prev;
    });
  };

  const solveVulnerabilities = async (testId: string): Promise<boolean> => {
    // Get current user
    const currentUser = localStorage.getItem("cyberxpert-user");
    if (!currentUser) return false;
    
    const user: User = JSON.parse(currentUser);
    
    // Only allow if user is admin
    if (user.role !== "admin") {
      return false;
    }

    // Simulate solving process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setTestHistory(prev => prev.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          details: {
            ...test.details,
            mitigationApplied: true,
            mitigationSuccess: Math.random() > 0.2 // 80% success rate
          }
        };
      }
      return test;
    }));

    return true;
  };

  const generateDetailedReport = async (testId: string): Promise<boolean> => {
    // Get current user
    const currentUser = localStorage.getItem("cyberxpert-user");
    if (!currentUser) return false;
    
    const user: User = JSON.parse(currentUser);
    
    // Only allow if user is admin
    if (user.role !== "admin") {
      return false;
    }

    const test = testHistory.find(t => t.id === testId);
    if (!test) return false;

    // Generate a detailed report
    const newReport: ReportItem = {
      id: `report-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      read: false,
      createdBy: test.createdBy,
      securityPosture: {
        score: test.details.score,
        criticalIssues: test.details.vulnerabilityDetails?.filter(v => v.severity === "Critical").length || 0,
        highIssues: test.details.vulnerabilityDetails?.filter(v => v.severity === "High").length || 0,
        mediumIssues: test.details.vulnerabilityDetails?.filter(v => v.severity === "Medium").length || 0,
        lowIssues: test.details.vulnerabilityDetails?.filter(v => v.severity === "Low").length || 0,
        details: `Detailed analysis of test ${testId} revealing ${test.details.vulnerabilities} security issues across ${test.details.components} components.`
      }
    };

    addReport(newReport);
    return true;
  };

  const refreshData = () => {
    // Simulate data refresh
    const refreshedAnalytics: AnalyticsData = {
      ...analytics,
      trend: Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "stable",
      monthlyData: analytics.monthlyData.map(item => ({
        ...item,
        score: Math.max(0, Math.min(100, item.score + (Math.random() - 0.5) * 10))
      }))
    };
    
    setAnalytics(refreshedAnalytics);
  };

  return (
    <DataContext.Provider value={{
      testHistory,
      reports,
      analytics,
      analyticsData: analytics,
      isAnalyzing,
      isLoading,
      currentAnalysis,
      startAnalysis,
      addTestResult,
      addReport,
      markReportAsRead,
      deleteTest,
      solveVulnerabilities,
      generateDetailedReport,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};
