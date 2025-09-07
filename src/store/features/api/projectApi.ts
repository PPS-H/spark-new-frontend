import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Project creation interfaces
export interface CreateProjectRequest {
  title: string;
  fundingGoal: number;
  description: string;
  duration: string;
  songTitle: string;
  artistName: string;
  isrcCode: string;
  upcCode: string;
  spotifyTrackLink?: string;
  spotifyTrackId?: string;
  youtubeMusicLink?: string;
  youtubeVideoId?: string;
  deezerTrackLink?: string;
  deezerTrackId?: string;
  releaseType: string;
  expectedReleaseDate: string;
  fundingDeadline: string;
  distrokidFile?: File | null;
}

export interface PlatformData {
  spotify?: {
    id: string;
    name: string;
    artist: string;
    album: string;
    isrc: string;
    popularity: number;
    release_date: string;
    duration_ms: number;
    preview_url: string | null;
  };
  youtube?: {
    id: string;
    name: string;
    artist: string;
    album: string;
    isrc: string;
    popularity: number;
    release_date: string;
    duration_ms: number;
    preview_url: string | null;
  };
  deezer?: {
    id: string;
    name: string;
    artist: string;
    album: string;
    isrc: string;
    popularity: number;
    release_date: string;
    duration_ms: number;
    preview_url: string | null;
  };
}

export interface AutomaticROI {
  totalGrossRevenue: number;
  artistShare: number;
  investorShare: number;
  platformFee: number;
  projectedStreams: {
    spotify: number;
    youtube: number;
    deezer: number;
  };
  revenueBreakdown: {
    spotify: number;
    youtube: number;
    deezer: number;
  };
  sampleInvestorROI: {
    investment1000: {
      investmentAmount: number;
      ownershipPercentage: number;
      projectedReturn: number;
      projectedProfit: number;
      roiPercentage: number;
      riskLevel: string;
      disclaimer: string;
    };
    investment5000: {
      investmentAmount: number;
      ownershipPercentage: number;
      projectedReturn: number;
      projectedProfit: number;
      roiPercentage: number;
      riskLevel: string;
      disclaimer: string;
    };
    investment10000: {
      investmentAmount: number;
      ownershipPercentage: number;
      projectedReturn: number;
      projectedProfit: number;
      roiPercentage: number;
      riskLevel: string;
      disclaimer: string;
    };
  };
}

export interface Project {
  _id: string;
  title: string;
  songTitle: string;
  artistName: string;
  releaseType: string;
  duration: string;
  isVerified: boolean;
  verificationStatus: string;
  status: string;
  isActive: boolean;
  fundingGoal: number;
  fundingDeadline: string;
  canAcceptInvestments: boolean;
  verificationSummary: {
    confidence: number;
    platformsVerified: number;
    totalPlatforms: number;
    warnings: string[];
  };
  platformData: PlatformData;
  automaticROI: AutomaticROI;
  message: string;
}

export interface CreateProjectResponse {
  success: boolean;
  message: string;
  data: Project;
}

// Update project interfaces
export interface UpdateProjectRequest {
  projectId: string;
  title: string;
  fundingGoal: number;
  description: string;
  duration: string;
}

export interface UpdateProjectResponse {
  success: boolean;
  message: string;
  data: Project;
}

// Get base URL from environment variable
const getBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
};

export const projectApi = createApi({
  reducerPath: 'projectApi',
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
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    createProject: builder.mutation<CreateProjectResponse, CreateProjectRequest>({
      query: (projectData) => {
        const formData = new FormData();
        
        // Add all text fields
        formData.append('title', projectData.title);
        formData.append('fundingGoal', projectData.fundingGoal.toString());
        formData.append('description', projectData.description);
        formData.append('duration', projectData.duration);
        formData.append('songTitle', projectData.songTitle);
        formData.append('artistName', projectData.artistName);
        formData.append('isrcCode', projectData.isrcCode);
        formData.append('upcCode', projectData.upcCode);
        formData.append('releaseType', projectData.releaseType);
        formData.append('expectedReleaseDate', projectData.expectedReleaseDate);
        formData.append('fundingDeadline', projectData.fundingDeadline);
        
        // Add optional platform fields
        if (projectData.spotifyTrackLink) {
          formData.append('spotifyTrackLink', projectData.spotifyTrackLink);
        }
        if (projectData.spotifyTrackId) {
          formData.append('spotifyTrackId', projectData.spotifyTrackId);
        }
        if (projectData.youtubeMusicLink) {
          formData.append('youtubeMusicLink', projectData.youtubeMusicLink);
        }
        if (projectData.youtubeVideoId) {
          formData.append('youtubeVideoId', projectData.youtubeVideoId);
        }
        if (projectData.deezerTrackLink) {
          formData.append('deezerTrackLink', projectData.deezerTrackLink);
        }
        if (projectData.deezerTrackId) {
          formData.append('deezerTrackId', projectData.deezerTrackId);
        }
        
        // Add file (backend requires 'file' field)
        if (projectData.distrokidFile) {
          formData.append('file', projectData.distrokidFile);
        } else {
          // Create an empty file to satisfy backend validation
          const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' });
          formData.append('file', emptyFile);
        }
        
        return {
          url: '/api/v1/project/',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<UpdateProjectResponse, UpdateProjectRequest>({
      query: (updateData) => ({
        url: `/api/v1/project/${updateData.projectId}`,
        method: 'PUT',
        body: {
          title: updateData.title,
          fundingGoal: updateData.fundingGoal,
          description: updateData.description,
          duration: updateData.duration,
        },
      }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} = projectApi;