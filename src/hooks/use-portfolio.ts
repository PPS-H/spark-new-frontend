import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useUserPortfolioSummary(userId: number) {
  return useQuery({
    queryKey: ["/api/portfolio/summary", userId],
    queryFn: async () => {
      const response = await fetch(`/api/portfolio/summary/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio summary");
      }
      return response.json();
    },
    enabled: !!userId,
  });
}

export function usePortfolioSummary() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [`/api/portfolio/summary/${user?.id}`],
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  });
}