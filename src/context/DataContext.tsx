
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

// Test history item type
export interface TestHistoryItem {
  id: string;
  date: string;
  time: string;
  status: "completed" | "failed" | "pending";
  details: {
    duration: string;
    components: number;
    vulnerabilities: number;
    score: number;
  };
}

// Report item type
export interface ReportItem {
  id: string;
  date: string;
  time: string;
  read: boolean; // Added the read property
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

// Initial mock data
const initialTestHistory: TestHistoryItem[] = [
  {
    id: "test-001",
    date: "2025-05-01",
    time: "09:30 AM",
    status: "completed",
    details: {
      duration: "3m 24s",
      components: 42,
      vulnerabilities: 7,
      score: 78
    }
  },
  {
    id: "test-002",
    date: "2025-05-02",
    time: "02:15 PM",
    status: "completed",
    details: {
      duration: "2m 58s",
      components: 38,
      vulnerabilities: 5,
      score: 85
    }
  },
  {
    id: "test-003",
    date: "2025-05-04",
    time: "11:45 AM",
    status: "failed",
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
    read: false, // Added read property to existing reports
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
    read: false, // Added read property to existing reports
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
  const [testHistory, setTestHistory] = useState<TestHistoryItem[]>(initialTestHistory);
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(initialAnalyticsData);
  const [isLoading, setIsLoading] = useState(false);

  // Generate a random security posture report
  const generateSecurityPosture = (): ReportItem["securityPosture"] => {
    const score = Math.floor(Math.random() * 30) + 70; // 70-99
    const criticalIssues = Math.floor(Math.random() * 2); // 0-1
    const highIssues = Math.floor(Math.random() * 3); // 0-2
    const mediumIssues = Math.floor(Math.random() * 4); // 0-3
    const lowIssues = Math.floor(Math.random() * 5); // 0-4
    
    const vulnerabilityTypes = [
      "Authentication bypass",
      "SQL injection",
      "Cross-site scripting",
      "Insecure dependencies",
      "API exposure",
      "Weak encryption",
      "Access control",
      "CSRF vulnerability",
      "File upload vulnerability",
      "Server misconfiguration"
    ];
    
    // Pick 1-3 random vulnerabilities
    const numVulnerabilities = Math.floor(Math.random() * 3) + 1;
    const selectedVulnerabilities = [];
    for (let i = 0; i < numVulnerabilities; i++) {
      const index = Math.floor(Math.random() * vulnerabilityTypes.length);
      selectedVulnerabilities.push(vulnerabilityTypes[index]);
    }
    
    const details = selectedVulnerabilities.map(v => 
      `${v} detected in application components. Remediation recommended.`
    ).join(" ");
    
    return {
      score,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues,
      details
    };
  };

  // Format the current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return { date, time };
  };

  // Start a new analysis
  const startAnalysis = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API delay (3-5 seconds)
      const analysisTime = Math.floor(Math.random() * 2000) + 3000;
      await new Promise(resolve => setTimeout(resolve, analysisTime));
      
      // Generate new test ID
      const newTestId = `test-${String(testHistory.length + 1).padStart(3, '0')}`;
      const reportId = `report-${String(reports.length + 1).padStart(3, '0')}`;
      const { date, time } = getCurrentDateTime();
      
      // Create new test history item
      const newTest: TestHistoryItem = {
        id: newTestId,
        date,
        time,
        status: "completed",
        details: {
          duration: `${Math.floor(analysisTime / 1000)}s`,
          components: Math.floor(Math.random() * 20) + 30, // 30-49
          vulnerabilities: Math.floor(Math.random() * 8) + 3, // 3-10
          score: Math.floor(Math.random() * 30) + 70 // 70-99
        }
      };
      
      // Create new report
      const newReport: ReportItem = {
        id: reportId,
        date,
        time,
        read: false, // Set new report as unread
        securityPosture: generateSecurityPosture()
      };
      
      // Update state with new data
      setTestHistory(prev => [newTest, ...prev]);
      setReports(prev => [newReport, ...prev]);
      
      // Update analytics data
      const newAnalytics = { ...analyticsData };
      newAnalytics.totalTests += 1;
      
      // Update tests over time
      const lastDateEntry = newAnalytics.testsOverTime[newAnalytics.testsOverTime.length - 1];
      if (lastDateEntry.date === date.split('-')[2]) {
        lastDateEntry.count += 1;
      } else {
        newAnalytics.testsOverTime.push({ date: date.split('-')[2], count: 1 });
        if (newAnalytics.testsOverTime.length > 7) {
          newAnalytics.testsOverTime.shift();
        }
      }
      
      // Recalculate average score
      const allScores = [...testHistory, newTest].map(t => t.details.score).filter(s => s > 0);
      newAnalytics.averageScore = Math.round(
        allScores.reduce((sum, score) => sum + score, 0) / allScores.length
      );
      
      // Update score distribution
      const scoreRange = 
        newTest.details.score <= 25 ? "0-25" :
        newTest.details.score <= 50 ? "26-50" :
        newTest.details.score <= 75 ? "51-75" : "76-100";
      
      const rangeIndex = newAnalytics.scoreDistribution.findIndex(d => d.range === scoreRange);
      if (rangeIndex >= 0) {
        newAnalytics.scoreDistribution[rangeIndex].count += 1;
      }
      
      setAnalyticsData(newAnalytics);
      
      // Notify user
      toast.success("Analysis completed successfully!");
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Analysis failed");
      setIsLoading(false);
      return false;
    }
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
      isLoading,
      startAnalysis,
      getTestById,
      getReportById
    }}>
      {children}
    </DataContext.Provider>
  );
};
