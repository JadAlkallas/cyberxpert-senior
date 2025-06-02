import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "./AuthContext";
import { securityApi } from "@/services/securityApi";
import { useApi } from "@/hooks/useApi";

// Vulnerability detail type
export interface VulnerabilityDetail {
  type: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status?: 'fixed' | 'in_progress' | 'not_addressed';
}

// Test history item type
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

// Report item type
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

// Analytics data type
export interface AnalyticsData {
  totalTests: number;
  averageScore: number;
  criticalIssues: number;
  resolvedIssues: number;
  testsOverTime: { date: string; count: number }[];
  scoreDistribution: { range: string; count: number }[];
  vulnerabilityCategories: { category: string; count: number }[];
}

interface DataContextType {
  testHistory: TestHistoryItem[];
  reports: ReportItem[];
  analyticsData: AnalyticsData;
  isLoading: boolean;
  startAnalysis: () => Promise<boolean>;
  getTestById: (id: string) => TestHistoryItem | undefined;
  getReportById: (id: string) => ReportItem | undefined;
  getUserVisibleTests: () => TestHistoryItem[];
  getUserVisibleReports: () => ReportItem[];
  refreshData: () => Promise<void>;
  solveVulnerabilities: (testId: string) => Promise<boolean>;
}

// Create the context
const DataContext = createContext<DataContextType | null>(null);

// Create a hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// Common vulnerability types
const vulnerabilityTypes = [
  {
    type: "Authentication Bypass",
    description: "Vulnerability allowing users to bypass authentication mechanisms",
    severity: 'critical'
  },
  {
    type: "SQL Injection",
    description: "Ability to inject malicious SQL code that could manipulate database operations",
    severity: 'high'
  },
  {
    type: "Cross-Site Scripting (XSS)",
    description: "Injection of client-side scripts into web pages viewed by other users",
    severity: 'high'
  },
  {
    type: "Insecure Dependencies",
    description: "Use of third-party libraries with known security vulnerabilities",
    severity: 'medium'
  },
  {
    type: "API Exposure",
    description: "Sensitive API endpoints exposed without proper authorization",
    severity: 'medium'
  },
  {
    type: "Weak Encryption",
    description: "Use of weak or outdated encryption algorithms for sensitive data",
    severity: 'high'
  },
  {
    type: "Access Control Flaws",
    description: "Improper implementation of access controls allowing unauthorized actions",
    severity: 'medium'
  },
  {
    type: "CSRF Vulnerability",
    description: "Cross-Site Request Forgery allowing attackers to perform actions as authenticated users",
    severity: 'medium'
  },
  {
    type: "File Upload Vulnerability",
    description: "Insecure file upload implementation that could allow malicious files",
    severity: 'medium'
  },
  {
    type: "Server Misconfiguration",
    description: "Server settings that expose security vulnerabilities or sensitive information",
    severity: 'low'
  }
] as const;

// Initial mock data with vulnerability details
const initialTestHistory: TestHistoryItem[] = [
  {
    id: "test-001",
    date: "2025-05-01",
    time: "09:30 AM",
    status: "completed",
    createdBy: {
      id: "dev-1",
      username: "developer1"
    },
    details: {
      duration: "3m 24s",
      components: 42,
      vulnerabilities: 7,
      score: 78,
      vulnerabilityDetails: [
        { ...vulnerabilityTypes[0], status: 'not_addressed' },
        { ...vulnerabilityTypes[1], status: 'not_addressed' },
        { ...vulnerabilityTypes[3], status: 'not_addressed' },
        { ...vulnerabilityTypes[4], status: 'not_addressed' },
        { ...vulnerabilityTypes[7], status: 'not_addressed' },
        { ...vulnerabilityTypes[8], status: 'not_addressed' },
        { ...vulnerabilityTypes[9], status: 'not_addressed' }
      ]
    }
  },
  {
    id: "test-002",
    date: "2025-05-02",
    time: "02:15 PM",
    status: "completed",
    createdBy: {
      id: "dev-2",
      username: "developer2"
    },
    details: {
      duration: "2m 58s",
      components: 38,
      vulnerabilities: 5,
      score: 85,
      vulnerabilityDetails: [
        { ...vulnerabilityTypes[2], status: 'not_addressed' },
        { ...vulnerabilityTypes[3], status: 'not_addressed' },
        { ...vulnerabilityTypes[5], status: 'not_addressed' },
        { ...vulnerabilityTypes[8], status: 'not_addressed' },
        { ...vulnerabilityTypes[9], status: 'not_addressed' }
      ]
    }
  },
  {
    id: "test-003",
    date: "2025-05-04",
    time: "11:45 AM",
    status: "failed",
    createdBy: {
      id: "dev-1",
      username: "developer1"
    },
    details: {
      duration: "0m 47s",
      components: 12,
      vulnerabilities: 0,
      score: 0
    }
  }
];

const initialReports: ReportItem[] = [
  {
    id: "report-001",
    date: "2025-05-01",
    time: "09:34 AM",
    read: false,
    createdBy: {
      id: "dev-1",
      username: "developer1"
    },
    securityPosture: {
      score: 78,
      criticalIssues: 1,
      highIssues: 2,
      mediumIssues: 3,
      lowIssues: 1,
      details: "Authentication vulnerability detected in login component. Cross-site scripting risk in form validation."
    }
  },
  {
    id: "report-002",
    date: "2025-05-02",
    time: "02:18 PM",
    read: false,
    createdBy: {
      id: "dev-2",
      username: "developer2"
    },
    securityPosture: {
      score: 85,
      criticalIssues: 0,
      highIssues: 2,
      mediumIssues: 2,
      lowIssues: 1,
      details: "Possible SQL injection vulnerability in search function. Outdated library dependencies with known security issues."
    }
  }
];

const initialAnalyticsData: AnalyticsData = {
  totalTests: 5,
  averageScore: 82,
  criticalIssues: 1,
  resolvedIssues: 3,
  testsOverTime: [
    { date: "Apr 28", count: 1 },
    { date: "Apr 29", count: 0 },
    { date: "Apr 30", count: 1 },
    { date: "May 1", count: 1 },
    { date: "May 2", count: 1 },
    { date: "May 3", count: 0 },
    { date: "May 4", count: 1 }
  ],
  scoreDistribution: [
    { range: "0-25", count: 0 },
    { range: "26-50", count: 0 },
    { range: "51-75", count: 1 },
    { range: "76-100", count: 4 }
  ],
  vulnerabilityCategories: [
    { category: "Authentication", count: 2 },
    { category: "Injection", count: 3 },
    { category: "XSS", count: 2 },
    { category: "Dependencies", count: 4 },
    { category: "Configuration", count: 1 }
  ]
};

// Create the data provider
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [testHistory, setTestHistory] = useState<TestHistoryItem[]>(initialTestHistory);
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(initialAnalyticsData);
  const [isLoading, setIsLoading] = useState(false);

  // API hooks
  const startAnalysisApi = useApi(securityApi.startAnalysis, {
    showSuccessToast: true,
    successMessage: "Analysis started successfully!"
  });

  const getTestsApi = useApi(securityApi.getTests);
  const getReportsApi = useApi(securityApi.getReports);
  const getAnalyticsApi = useApi(securityApi.getAnalytics);
  const solveVulnerabilitiesApi = useApi(securityApi.solveVulnerabilities, {
    showSuccessToast: true,
    successMessage: "Vulnerability analysis complete"
  });

  // Load initial data when user changes
  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      // Clear data when user logs out
      setTestHistory([]);
      setReports([]);
      setAnalyticsData({
        totalTests: 0,
        averageScore: 0,
        criticalIssues: 0,
        resolvedIssues: 0,
        testsOverTime: [],
        scoreDistribution: [],
        vulnerabilityCategories: []
      });
    }
  }, [user]);

  // Refresh all data from API
  const refreshData = async (): Promise<void> => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Determine API parameters based on user role
      const apiParams = user.role === 'Admin' ? {} : { userId: user.id };

      // Fetch all data in parallel
      const [testsData, reportsData, analyticsResult] = await Promise.all([
        getTestsApi.execute(apiParams),
        getReportsApi.execute(apiParams),
        getAnalyticsApi.execute(user.role === 'Admin' ? undefined : user.id)
      ]);

      if (testsData) {
        setTestHistory(testsData.tests);
      }

      if (reportsData) {
        setReports(reportsData.reports);
      }

      if (analyticsResult) {
        setAnalyticsData(analyticsResult);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tests based on user role
  const getUserVisibleTests = () => {
    if (!user) return [];
    
    // Admin can see all tests
    if (user.role === 'Admin') {
      return testHistory;
    }
    
    // Developers can only see their own tests
    return testHistory.filter(test => test.createdBy?.id === user.id);
  };
  
  // Filter reports based on user role
  const getUserVisibleReports = () => {
    if (!user) return [];
    
    // Admin can see all reports
    if (user.role === 'Admin') {
      return reports;
    }
    
    // Developers can only see their own reports
    return reports.filter(report => report.createdBy?.id === user.id);
  };

  // Start a new analysis
  const startAnalysis = async (): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to start analysis');
      return false;
    }

    try {
      setIsLoading(true);
      
      const analysisRequest = {
        userId: user.id,
        analysisType: 'full' as const
      };

      const result = await startAnalysisApi.execute(analysisRequest);
      
      if (result) {
        // Poll for analysis completion
        const pollForCompletion = async (analysisId: string) => {
          const checkStatus = async () => {
            try {
              const statusResponse = await securityApi.getAnalysisStatus(analysisId);
              
              if (statusResponse.status === 'completed') {
                // Refresh data to get the new test and report
                await refreshData();
                toast.success('Analysis completed successfully!');
                setIsLoading(false);
                return true;
              } else if (statusResponse.status === 'failed') {
                toast.error('Analysis failed');
                setIsLoading(false);
                return false;
              } else {
                // Continue polling
                setTimeout(checkStatus, 2000);
              }
            } catch (error) {
              console.error('Failed to check analysis status:', error);
              setIsLoading(false);
              return false;
            }
          };
          
          await checkStatus();
        };

        // Start polling
        pollForCompletion(result.analysisId);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Analysis error:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Solve vulnerabilities for a test
  const solveVulnerabilities = async (testId: string): Promise<boolean> => {
    const result = await solveVulnerabilitiesApi.execute(testId);
    
    if (result?.success) {
      // Refresh data to get updated test status
      await refreshData();
      return true;
    }
    
    return false;
  };

  // Get a test by ID
  const getTestById = (id: string) => {
    return testHistory.find(test => test.id === id);
  };

  // Get a report by ID
  const getReportById = (id: string) => {
    return reports.find(report => report.id === id);
  };

  return (
    <DataContext.Provider value={{
      testHistory,
      reports,
      analyticsData,
      isLoading: isLoading || startAnalysisApi.loading,
      startAnalysis,
      getTestById,
      getReportById,
      getUserVisibleTests,
      getUserVisibleReports,
      refreshData,
      solveVulnerabilities
    }}>
      {children}
    </DataContext.Provider>
  );
};
