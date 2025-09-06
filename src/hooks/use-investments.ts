import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { InsertInvestment } from "@/types/artist";

export function useInvestments() {
  const queryClient = useQueryClient();

  const createInvestment = useMutation({
    mutationFn: async (data: InsertInvestment) => {
      const response = await apiRequest("POST", "/api/investments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] });
      queryClient.invalidateQueries({ queryKey: ['/api/investments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
  });

  return {
    createInvestment,
  };
}

export function useUserInvestments(userId: number) {
  return useQuery({
    queryKey: [`/api/investments/user/${userId}`],
    enabled: !!userId,
  });
}
