
// Mock data for development and testing purposes

export interface User {
  id: string;
  username: string;
  email: string;
  role: "Admin" | "Dev";
}

export interface TestHistory {
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

export interface SecurityReport {
  id: string;
  testId: string;
  date: string;
  time: string;
  score: number;
  issues: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  details: string;
}

// Mock users
export const mockUsers: User[] = [
  {
    id: "user-001",
    username: "admin_user",
    email: "admin@example.com",
    role: "Admin"
  },
  {
    id: "user-002",
    username: "dev_user",
    email: "dev@example.com",
    role: "Dev"
  }
];

// Mock test history
export const mockTestHistory: TestHistory[] = [
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

// Mock security reports
export const mockSecurityReports: SecurityReport[] = [
  {
    id: "report-001",
    testId: "test-001",
    date: "2025-05-01",
    time: "09:34 AM",
    score: 78,
    issues: {
      critical: 1,
      high: 2,
      medium: 3,
      low: 1
    },
    details: "Authentication vulnerability detected in login component. Cross-site scripting risk in form validation."
  },
  {
    id: "report-002",
    testId: "test-002",
    date: "2025-05-02",
    time: "02:18 PM",
    score: 85,
    issues: {
      critical: 0,
      high: 2,
      medium: 2,
      low: 1
    },
    details: "Possible SQL injection vulnerability in search function. Outdated library dependencies with known security issues."
  }
];

// Mock analytics data
export const mockAnalyticsData = {
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
