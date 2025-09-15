import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types for the Admin API
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      isAdmin: boolean;
    };
  };
}

export interface AdminGetDraftProjectsRequest {
  page?: number;
  limit?: number;
}

export interface AdminGetDraftProjectsResponse {
  success: boolean;
  message: string;
  data: {
    projects: any[];
  };
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminProjectIdRequest {
  projectId: string;
}

export interface AdminApproveRejectProjectRequest {
  action: 'approve' | 'reject';
  reason?: string;
}

export interface AdminApproveRejectProjectResponse {
  success: boolean;
  message: string;
  data: {
    project: any;
    message: string;
  };
}

export interface AdminGetProjectDetailsResponse {
  success: boolean;
  message: string;
  data: {
    project: any;
    fundingStats: {
      totalRaised: number;
      totalInvestors: number;
      fundingProgress: number;
    };
  };
}

// Create the admin API slice
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL +"/api/v1/admin"|| 'http://localhost:3000/api/v1/admin',
    prepareHeaders: (headers, { getState }) => {
      // Get admin token from sessionStorage
      const adminToken = sessionStorage.getItem('adminToken');
      if (adminToken) {
        headers.set('authorization', `Bearer ${adminToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AdminProjects', 'AdminProjectDetails'],
  endpoints: (builder) => ({
    // Admin Login
    adminLogin: builder.mutation<AdminLoginResponse, AdminLoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['AdminProjects'],
    }),

    // Get Draft Projects
    getDraftProjects: builder.query<AdminGetDraftProjectsResponse, AdminGetDraftProjectsRequest | void>({
      query: (params = {}) => ({
        url: '/draft-projects',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: ['AdminProjects'],
    }),

    // Approve/Reject Project
    approveRejectProject: builder.mutation<
      AdminApproveRejectProjectResponse,
      { projectId: string; data: AdminApproveRejectProjectRequest }
    >({
      query: ({ projectId, data }) => ({
        url: `/project/${projectId}/approve-reject`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AdminProjects', 'AdminProjectDetails'],
    }),

    // Get Project Details
    getProjectDetails: builder.query<AdminGetProjectDetailsResponse, string>({
      query: (projectId) => ({
        url: `/project/${projectId}`,
        method: 'GET',
      }),
      providesTags: ['AdminProjectDetails'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useAdminLoginMutation,
  useGetDraftProjectsQuery,
  useApproveRejectProjectMutation,
  useGetProjectDetailsQuery,
} = adminApi;
