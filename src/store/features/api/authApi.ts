import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types for the API
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  country?: string;
  favoriteGenre?: string;
  musicPlatforms?: string[];
  aboutTxt?: string;
  role: 'artist' | 'label' | 'fan';
  // Artist-specific fields
  artistBio?: string;
  instagram?: string;
  youtube?: string;
  spotify?: string;
  // Label-specific fields
  companyType?: string;
  teamSize?: string;
  website?: string;
  companyDescription?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      username: string;
      email: string;
      password: string;
      country?: string;
      favoriteGenre?: string;
      musicPlatforms: string[];
      role: string;
      companyType?: string;
      teamSize?: string;
      website?: string;
      companyDescription?: string;
      artistBio?: string;
      instagram?: string;
      youtube?: string;
      spotify?: string;
      isDeleted: boolean;
      isStripeAccountConnected: boolean;
      isPaymentMethodAdded: boolean;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  };
}

export interface GetUserProfileRequest {
  userId?: string;
}

export interface GetUserProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      username: string;
      email: string;
      password: string;
      country?: string;
      favoriteGenre?: string;
      musicPlatforms: string[];
      role: string;
      companyType?: string;
      teamSize?: string;
      website?: string;
      companyDescription?: string;
      artistBio?: string;
      aboutTxt?: string;
      instagram?: string;
      youtube?: string;
      spotify?: string;
      profilePicture?: string;
      isDeleted: boolean;
      isStripeAccountConnected: boolean;
      isPaymentMethodAdded: boolean;
      createdAt: string;
      updatedAt: string;
      __v: number;
      totalFundsRaised: number;
      totalFundingGoal: number;
      monthlyROI: number;
      totalProjects: number;
      totalInvestors: number;
      isFollowed:boolean;
    };
  };
}

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  country?: string;
  favoriteGenre?: string;
  musicPlatforms: string[];
  role: string;
  companyType?: string;
  teamSize?: string;
  website?: string;
  companyDescription?: string;
  artistBio?: string;
  instagram?: string;
  youtube?: string;
  spotify?: string;
  aboutTxt?: string;
  isDeleted: boolean;
  isStripeAccountConnected: boolean;
  isPaymentMethodAdded: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // Settings fields
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  fundingAlerts?: boolean;
  publicProfile?: boolean;
  investmentActivity?: boolean;
  directMessages?: boolean;
  autoPreview?: boolean;
  language?: boolean;
  darkMode?: boolean;
  profilePicture?: string;
}

export interface UpdateUserRequest {
  username?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  fundingAlerts?: boolean;
  publicProfile?: boolean;
  investmentActivity?: boolean;
  directMessages?: boolean;
  autoPreview?: boolean;
  language?: boolean;
  darkMode?: boolean;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface ChangePasswordRequest {
  password: string;
  oldPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface SendOtpRequest {
  email: string;
  type: number;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
  };
}

export interface VerifyOtpRequest {
  userId: string;
  otp: number;
  type: number;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordRequest {
  userId: string;
  password: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ContentUploadRequest {
  title: string;
  genre: string;
  description: string;
  file: File;
}

export interface ContentUploadResponse {
  success: boolean;
  message: string;
  data: {
    content: {
      _id: string;
      title: string;
      genre: string;
      description: string;
      fileName: string;
      fileType: string;
      fileSize: number;
      createdAt: string;
    };
  };
}

export interface ContentItem {
  _id: string;
  userId: string;
  title: string;
  file: string;
  genre: string;
  description: string;
  type: 'audio' | 'video' | 'image';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetContentResponse {
  success: boolean;
  message: string;
  data: ContentItem[];
}

// Get base URL from environment variable
const getBaseUrl = () => {
  // Use environment variable if available, otherwise fallback to localhost
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
};

export const authApi = createApi({
  reducerPath: 'authApi',
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
  tagTypes: ['User', 'Content'],
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/api/v1/user/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/api/v1/user/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    getMe: builder.query<MeResponse, void>({
      query: () => '/api/v1/user/',
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest | FormData>({
      query: (updateData) => ({
        url: '/api/v1/user',
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: '/api/v1/user/updatePassword',
        method: 'PUT',
        body: passwordData,
      }),
    }),
    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: (otpData) => ({
        url: '/api/v1/user/sendOtp',
        method: 'PUT',
        body: otpData,
      }),
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (otpData) => ({
        url: '/api/v1/user/verifyOtp',
        method: 'PUT',
        body: otpData,
      }),
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (passwordData) => ({
        url: '/api/v1/user/changePassword',
        method: 'PUT',
        body: passwordData,
      }),
    }),
    uploadContent: builder.mutation<ContentUploadResponse, ContentUploadRequest>({
      query: (contentData) => {
        const formData = new FormData();
        formData.append('title', contentData.title);
        formData.append('genre', contentData.genre);
        formData.append('description', contentData.description);
        formData.append('file', contentData.file);
        
        return {
          url: '/api/v1/content',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['User', 'Content'],
    }),
    getContent: builder.query<GetContentResponse, { type?: 'audio' | 'video' | 'image' } | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.type) {
          searchParams.append('type', params.type);
        }
        const queryString = searchParams.toString();
        return {
          url: `/api/v1/content${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: ['Content'],
    }),
    getUserProfile: builder.query<GetUserProfileResponse, GetUserProfileRequest | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.userId) {
          searchParams.append('userId', params.userId);
        }
        const queryString = searchParams.toString();
        return {
          url: `/api/v1/user/${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useUploadContentMutation,
  useGetContentQuery,
  useGetUserProfileQuery,
} = authApi; 