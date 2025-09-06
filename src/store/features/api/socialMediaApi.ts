import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ConnectSpotifyResponse {
  success: boolean;
  message: string;
  data: {
    authUrl: string;
    platform: string;
  };
}

// Get base URL from environment variable
const getBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
};

export const socialMediaApi = createApi({
  reducerPath: 'socialMediaApi',
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
  tagTypes: ['SocialMedia'],
  endpoints: (builder) => ({
    connectSpotify: builder.mutation<ConnectSpotifyResponse, void>({
      query: () => ({
        url: '/api/v1/socialMedia/connectSpotify',
        method: 'GET',
      }),
      invalidatesTags: ['SocialMedia'],
    }),
  }),
});

export const {
  useConnectSpotifyMutation,
} = socialMediaApi; 