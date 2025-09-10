import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types for Analytics API
export interface AnalyticsData {
  totalRevenue: number;
  totalEngagement: number;
  followers: number;
  likes: number;
  totalProjects: number;
  totalFundsRaised: number;
  totalFundingGoal: number;
  monthlyROI: number;
  totalInvestors: number;
  activeProjects: number;
  draftProjects: number;
  totalInvestments: number;
  totalInvestedAmount: number;
  averageReturn: number;
  activeInvestments: number;
  completedInvestments: number;
  cancelledInvestments: number;
  contentBreakdown: {
    audio: { percentage: number; count: number };
    video: { percentage: number; count: number };
    image: { percentage: number; count: number };
  };
  revenueBreakdown: {
    spotify: { percentage: number; amount: number };
    youtube: { percentage: number; amount: number };
  };
  projectStatusBreakdown: {
    active: { percentage: number; count: number };
    draft: { percentage: number; count: number };
  };
  investmentStatusBreakdown: {
    active: { percentage: number; count: number };
    completed: { percentage: number; count: number };
    cancelled: { percentage: number; count: number };
  };
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: AnalyticsData;
}

// Get base URL from environment variable
const getBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
};

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsResponse, void>({
      query: () => '/api/v1/artist/analytics',
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetAnalyticsQuery,
} = analyticsApi;
