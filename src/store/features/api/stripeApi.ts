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

export interface CreateSubscriptionCheckoutRequest {
  priceId: string;
  userId: string;
}

export interface CreateSubscriptionCheckoutResponse {
  success: boolean;
  message: string;
  data: {
    sessionId: string;
    url: string;
  };
}

export interface SubscriptionDetails {
  _id: string;
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  stripeProductId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  trialStart?: string;
  trialEnd?: string;
  planType: 'artist' | 'label';
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserSubscriptionResponse {
  success: boolean;
  message: string;
  data: SubscriptionDetails | null;
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
  tagTypes: ['StripeProducts', 'UserSubscription'],
  endpoints: (builder) => ({
    // Get Stripe products with optional type filter
    getStripeProducts: builder.query<GetStripeProductsResponse, { type?: string } | void>({
      query: (params) => ({
        url: '/api/v1/payment/products',
        method: 'GET',
        params: params || {},
      }),
      providesTags: ['StripeProducts'],
    }),
    // Create subscription checkout
    createSubscriptionCheckout: builder.mutation<CreateSubscriptionCheckoutResponse, CreateSubscriptionCheckoutRequest>({
      query: (checkoutData) => ({
        url: '/api/v1/payment/create-subscription-checkout',
        method: 'POST',
        body: checkoutData,
      }),
    }),
    // Get user subscription details
    getUserSubscription: builder.query<GetUserSubscriptionResponse, string>({
      query: (userId) => ({
        url: `/api/v1/payment/subscription/${userId}`,
        method: 'GET',
      }),
      providesTags: ['UserSubscription'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetStripeProductsQuery,
  useCreateSubscriptionCheckoutMutation,
  useGetUserSubscriptionQuery,
} = stripeApi;