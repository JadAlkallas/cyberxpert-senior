
import { apiRequest } from './api';
import { TestHistoryItem, ReportItem, AnalyticsData } from '@/context/DataContext';

// API request/response types
export interface StartAnalysisRequest {
  userId: string;
  projectId?: string;
  analysisType?: 'full' | 'quick' | 'targeted';
}

export interface StartAnalysisResponse {
  analysisId: string;
  estimatedDuration: number;
  status: 'initiated' | 'queued';
}

export interface GetTestsResponse {
  tests: TestHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface GetReportsResponse {
  reports: ReportItem[];
  total: number;
  page: number;
  limit: number;
}

// Security API service
export const securityApi = {
  // Start a new security analysis
  startAnalysis: async (data: StartAnalysisRequest): Promise<StartAnalysisResponse> => {
    return apiRequest<StartAnalysisResponse>('/security/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get analysis status
  getAnalysisStatus: async (analysisId: string): Promise<{ status: string; progress: number }> => {
    return apiRequest(`/security/analyze/${analysisId}/status`);
  },

  // Get user's test history
  getTests: async (params?: { 
    page?: number; 
    limit?: number; 
    userId?: string;
    status?: string;
  }): Promise<GetTestsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.status) searchParams.append('status', params.status);
    
    const query = searchParams.toString();
    return apiRequest(`/security/tests${query ? `?${query}` : ''}`);
  },

  // Get specific test by ID
  getTestById: async (testId: string): Promise<TestHistoryItem> => {
    return apiRequest(`/security/tests/${testId}`);
  },

  // Get user's reports
  getReports: async (params?: { 
    page?: number; 
    limit?: number; 
    userId?: string;
  }): Promise<GetReportsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.userId) searchParams.append('userId', params.userId);
    
    const query = searchParams.toString();
    return apiRequest(`/security/reports${query ? `?${query}` : ''}`);
  },

  // Get specific report by ID
  getReportById: async (reportId: string): Promise<ReportItem> => {
    return apiRequest(`/security/reports/${reportId}`);
  },

  // Get analytics data
  getAnalytics: async (userId?: string): Promise<AnalyticsData> => {
    const query = userId ? `?userId=${userId}` : '';
    return apiRequest(`/security/analytics${query}`);
  },

  // Solve vulnerabilities
  solveVulnerabilities: async (testId: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/security/tests/${testId}/solve`, {
      method: 'POST',
    });
  },

  // Generate detailed report
  generateDetailedReport: async (testId: string): Promise<{ reportUrl: string; reportId: string }> => {
    return apiRequest(`/security/tests/${testId}/report`, {
      method: 'POST',
    });
  },
};
