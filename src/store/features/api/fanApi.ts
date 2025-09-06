import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types for Featured Artists API
export interface FeaturedArtist {
  _id: string;
  username: string;
  email: string;
  favoriteGenre?: string;
  role: string;
  artistBio?: string;
  profileImage?: string;
  socialMediaLinks?: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
  };
  isLiked: boolean;
  fundingGoal: string;
  currentFunding: string;
  expectedReturn: string;
}

export interface GetFeaturedArtistsRequest {
  page?: number;
  limit?: number;
}

export interface GetFeaturedArtistsResponse {
  success: boolean;
  message: string;
  data: FeaturedArtist[];
  pagination: {
    page: string;
    limit: string;
    totalPages: number;
  };
}

export interface LikeDislikeArtistRequest {
  artistId: string;
}

export interface LikeDislikeArtistResponse {
  success: boolean;
  message: string;
}

export interface FollowUnfollowArtistRequest {
  artistId: string;
}

export interface FollowUnfollowArtistResponse {
  success: boolean;
  message: string;
}

// Get base URL from environment variable
const getBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
};

export const fanApi = createApi({
  reducerPath: 'fanApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Add auth headers for authenticated requests
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['FeaturedArtists', 'TrendingContent'],
  endpoints: (builder) => ({
    getFeaturedArtists: builder.query<GetFeaturedArtistsResponse, GetFeaturedArtistsRequest>({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/api/v1/artist',
        params: { page, limit },
      }),
      providesTags: ['FeaturedArtists'],
    }),
    likeDislikeArtist: builder.mutation<LikeDislikeArtistResponse, LikeDislikeArtistRequest>({
      query: ({ artistId }) => ({
        url: `/api/v1/artist/likeDislikeArtist/${artistId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['FeaturedArtists'],
    }),
    followUnfollowArtist: builder.mutation<FollowUnfollowArtistResponse, FollowUnfollowArtistRequest>({
      query: ({ artistId }) => ({
        url: `/api/v1/artist/followUnfollowArtist/${artistId}`,
        method: 'PUT',
      }),
      invalidatesTags: [
        'FeaturedArtists',
        { type: 'TrendingContent', id: 'artists' },
        { type: 'TrendingContent', id: 'top' },
        { type: 'TrendingContent', id: 'songs' },
      ],
    }),
  }),
});

export const {
  useGetFeaturedArtistsQuery,
  useLikeDislikeArtistMutation,
  useFollowUnfollowArtistMutation,
} = fanApi;
