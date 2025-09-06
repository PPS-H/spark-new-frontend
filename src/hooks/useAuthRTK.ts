import { useState, useEffect } from "react";
import { useRegisterMutation, useLoginMutation, useGetMeQuery } from "@/store/features/api/authApi";
import type { User } from "@/store/features/api/authApi";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // RTK Query hooks
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const { data: meData, isLoading: isMeLoading, error: meError, refetch } = useGetMeQuery(undefined, {
    skip: !localStorage.getItem('token'), // Skip if no token
  });

  // Handle user data from getMe query
  useEffect(() => {
    if (meData?.data?.user) {
      setUser(meData.data.user);
      setIsLoading(false);
    } else if (meError) {
      setUser(null);
      setIsLoading(false);
    } else if (meData && !meData.data?.user) {
      // API returned success but no user data
      setUser(null);
      setIsLoading(false);
    }
  }, [meData, meError]);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Token exists, getMe query will handle user data
      // Don't set loading to true here, let getMe query handle it
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await loginMutation(credentials).unwrap();
      if (result.data?.token) {
        localStorage.setItem('token', result.data.token);
        // Trigger getMe query to fetch user data
        refetch();
      }
      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoading(false);
    // Redirect to home page
    window.location.href = "/";
  };

  const register = async (userData: { username: string; email: string; password: string; role?: string }) => {
    try {
      // Ensure role is always set to a valid value
      const registerData = {
        ...userData,
        role: (userData.role as 'artist' | 'label' | 'fan') || 'fan'
      };
      
      const result = await registerMutation(registerData).unwrap();
      if (result.data) {
        // For registration, we might want to auto-login or show success message
        console.log("Registration successful:", result);
      }
      return result;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  return {
    user,
    isLoading: isLoading || (!!localStorage.getItem('token') && isMeLoading),
    isAuthenticated: !!user,
    login,
    logout,
    register,
    isLoginLoading,
    isLogoutLoading: false,
    isRegisterLoading,
  };
} 