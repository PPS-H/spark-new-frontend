import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Types for Project API
export interface Project {
  _id: string;
  userId: string;
  title: string;
  fundingGoal: number;
  description: string;
  duration: string;
  songTitle: string;
  artistName: string;
  isrcCode: string;
  upcCode: string;
  spotifyTrackLink: string;
  spotifyTrackId: string;
  releaseType: string;
  expectedReleaseDate: string;
  fundingDeadline: string;
  expectedROIPercentage: number;
  isVerified: boolean;
  verificationStatus: string;
  verifiedAt: string;
  status: string;
  isActive: boolean;
  distroKidConnected: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string; // Add image field
  __v: number;
}

export interface GetAllProjectsRequest {
  page: number;
  limit: number;
}

export interface GetAllProjectsResponse {
  success: boolean;
  message: string;
  data: {
    projects: Project[];
  };
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProjectDetails {
  _id: string;
  title: string;
  songTitle: string;
  artistName: string;
  image?: string; // Add image field
  artist: {
    _id: string;
    username: string;
    email: string;
    aboutTxt: string;
    artistBio: string;
    isLiked: boolean;
    isAlreadyInvested: boolean;
  };
}

export interface ArtistPerformance {
  monthlyListeners: number;
  expectedROI: number;
  riskLevel: string;
}

export interface FundingProgress {
  raised: number;
  goal: number;
  funded: number;
  totalInvestors: number;
}

export interface InvestmentLimits {
  min: number;
  max: number;
  remaining: number;
}

export interface ROIExplanation {
  model: string;
  investorShare: string;
  payoutFrequency: string;
  riskNote: string;
}

export interface GetProjectDetailsRequest {
  projectId: string;
}

export interface GetProjectDetailsResponse {
  success: boolean;
  message: string;
  data: {
    project: ProjectDetails;
    artistPerformance: ArtistPerformance;
    fundingProgress: FundingProgress;
    investmentLimits: InvestmentLimits;
    roiExplanation: ROIExplanation;
  };
}

export interface LikeDislikeArtistRequest {
  artistId: string;
}

export interface LikeDislikeArtistResponse {
  success: boolean;
  message: string;
}

// Checkout Session interfaces
interface CreateCheckoutSessionRequest {
  projectId: string;
  amount: number;
  currency?: string;
}

interface CreateCheckoutSessionResponse {
  success: boolean;
  message: string;
  data: {
    sessionId: string;
    url: string;
  };
}

// Invested Projects interfaces
export interface InvestedProjectUser {
  _id: string;
  username: string;
  email: string;
  country: string;
  favoriteGenre: string;
  aboutTxt?: string;
  artistBio?: string;
}

export interface InvestedProject {
  _id: string;
  userId: InvestedProjectUser;
  title: string;
  fundingGoal: number;
  description: string;
  duration: string;
  songTitle: string;
  artistName: string;
  isrcCode: string;
  upcCode: string;
  spotifyTrackLink: string;
  spotifyTrackId: string;
  releaseType: string;
  expectedReleaseDate: string;
  fundingDeadline: string;
  expectedROIPercentage: number;
  isVerified: boolean;
  verificationStatus: string;
  verifiedAt: string;
  status: string;
  isActive: boolean;
  distroKidConnected: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string; // Add image field
  __v: number;
}

export interface GetInvestedProjectsRequest {
  page: number;
  limit: number;
}

export interface GetInvestedProjectsResponse {
  success: boolean;
  message: string;
  data: {
    projects: InvestedProject[];
  };
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Create the API slice
export const labelApi = createApi({
  reducerPath: 'labelApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/v1`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Projects', 'ProjectDetails', 'InvestedProjects'],
  endpoints: (builder) => ({
    // Get all projects
    getAllProjects: builder.query<GetAllProjectsResponse, GetAllProjectsRequest>({
      query: ({ page, limit }) => ({
        url: `project/?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Projects'],
    }),
    // Get project details
    getProjectDetails: builder.query<GetProjectDetailsResponse, GetProjectDetailsRequest>({
      query: ({ projectId }) => ({
        url: `project/${projectId}`,
        method: 'GET',
      }),
      providesTags: ['ProjectDetails'],
    }),
    // Like/Dislike artist
    likeDislikeArtist: builder.mutation<LikeDislikeArtistResponse, LikeDislikeArtistRequest>({
      query: ({ artistId }) => ({
        url: `artist/likeDislikeArtist/${artistId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['ProjectDetails'],
    }),
    // Create checkout session
    createCheckoutSession: builder.mutation<CreateCheckoutSessionResponse, CreateCheckoutSessionRequest>({
      query: (body) => ({
        url: 'payment/createCheckoutSession',
        method: 'POST',
        body,
      }),
    }),
    // Get invested projects
    getInvestedProjects: builder.query<GetInvestedProjectsResponse, GetInvestedProjectsRequest>({
      query: ({ page, limit }) => ({
        url: `project/getInvestedProjects?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['InvestedProjects'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllProjectsQuery,
  useGetProjectDetailsQuery,
  useLikeDislikeArtistMutation,
  useCreateCheckoutSessionMutation,
  useGetInvestedProjectsQuery,
} = labelApi;
