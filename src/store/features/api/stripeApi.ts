import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
};

// Stripe Product interfaces
export interface StripePrice {
  id: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
}

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  type: 'artist' | 'label';
  price: StripePrice | null;
  features: string[];
  marketingFeatures: string[];
  active: boolean;
  created: number;
}

export interface GetStripeProductsResponse {
  success: boolean;
  message: string;
  data: StripeProduct[];
}

// Create the API slice
export const stripeApi = createApi({
  reducerPath: 'stripeApi',
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
  tagTypes: ['StripeProducts'],
  endpoints: (builder) => ({
    // Get Stripe products
    getStripeProducts: builder.query<GetStripeProductsResponse, void>({
      query: () => ({
        url: '/api/v1/payment/products',
        method: 'GET',
      }),
      providesTags: ['StripeProducts'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetStripeProductsQuery,
} = stripeApi;
