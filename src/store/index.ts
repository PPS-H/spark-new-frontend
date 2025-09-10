import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './features/api/authApi';
import { socialMediaApi } from './features/api/socialMediaApi';
import { fanApi } from './features/api/fanApi';
import { searchApi } from './features/api/searchApi';
import { labelApi } from './features/api/labelApi';
import { projectApi } from './features/api/projectApi';
import { analyticsApi } from './features/api/analyticsApi';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [socialMediaApi.reducerPath]: socialMediaApi.reducer,
    [fanApi.reducerPath]: fanApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [labelApi.reducerPath]: labelApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, socialMediaApi.middleware, fanApi.middleware, searchApi.middleware, labelApi.middleware, projectApi.middleware, analyticsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 