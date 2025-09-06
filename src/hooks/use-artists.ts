import { useQuery } from "@tanstack/react-query";
import { Artist } from "@/types/artist";

export function useArtists() {
  return useQuery<Artist[]>({
    queryKey: ['/api/artists'],
    staleTime: 10 * 1000, // 10 secondes - très court pour nouveaux artistes
    refetchInterval: 30 * 1000, // Rafraîchir toutes les 30 secondes 
    refetchOnWindowFocus: true, // Rafraîchir quand l'utilisateur revient
    refetchOnMount: true, // Toujours rafraîchir au montage
  });
}

export function useArtist(id: number) {
  return useQuery<Artist>({
    queryKey: ['/api/artists', id],
    enabled: !!id,
  });
}
