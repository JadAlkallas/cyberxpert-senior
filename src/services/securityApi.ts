
import { apiRequest } from './api';
import { TestHistoryItem, ReportItem, AnalyticsData } from '@/context/DataContext';
import { PaginatedResponse, AnalysisStatus } from '@/types/api';

// API request/response types for Django
export interface StartAnalysisRequest {
  user_id: string; // Django uses snake_case
  project_id?: string;
  analysis_type?: 'full' | 'quick' | 'targeted';
}

export interface StartAnalysisResponse {
  analysis_id: string;
  estimated_duration: number;
  status: AnalysisStatus;
}

export type GetTestsResponse = PaginatedResponse<TestHistoryItem>;
export type GetReportsResponse = PaginatedResponse<ReportItem>;

// Security API service for Django
export const securityApi = {
  // Start a new security analysis
  startAnalysis: async (data: StartAnalysisRequest): Promise<StartAnalysisResponse> => {
    return apiRequest<StartAnalysisResponse>('/security/analyze/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get analysis status
  getAnalysisStatus: async (analysisId: string): Promise<{ status: AnalysisStatus; progress: number }> => {
    return apiRequest(`/security/analyze/${analysisId}/status/`);
  },

  // Get user's test history
  getTests: async (params?: { 
    page?: number; 
    page_size?: number; // Django uses page_size instead of limit
    user_id?: string;
    status?: string;
  }): Promise<GetTestsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
    if (params?.user_id) searchParams.append('user_id', params.user_id);
    if (params?.status) searchParams.append('status', params.status);
    
    const query = searchParams.toString();
    return apiRequest(`/security/tests/${query ? `?${query}` : ''}`);
  },

  // Get specific test by ID
  getTestById: async (testId: string): Promise<TestHistoryItem> => {
    return apiRequest(`/security/tests/${testId}/`);
  },

  // Get user's reports
  getReports: async (params?: { 
    page?: number; 
    page_size?: number;
    user_id?: string;
  }): Promise<GetReportsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
    if (params?.user_id) searchParams.append('user_id', params.user_id);
    
    const query = searchParams.toString();
    return apiRequest(`/security/reports/${query ? `?${query}` : ''}`);
  },

  // Get specific report by ID
  getReportById: async (reportId: string): Promise<ReportItem> => {
    return apiRequest(`/security/reports/${reportId}/`);
  },

  // Get analytics data
  getAnalytics: async (userId?: string): Promise<AnalyticsData> => {
    const query = userId ? `?user_id=${userId}` : '';
    return apiRequest(`/security/analytics/${query}`);
  },

  // Solve vulnerabilities
  solveVulnerabilities: async (testId: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/security/tests/${testId}/solve/`, {
      method: 'POST',
    });
  },

  // Generate detailed report
  generateDetailedReport: async (testId: string): Promise<{ report_url: string; report_id: string }> => {
    return apiRequest(`/security/tests/${testId}/report/`, {
      method: 'POST',
    });
  },
};
