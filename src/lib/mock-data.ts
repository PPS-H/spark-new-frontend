import { Artist } from "@/types/artist";

export const mockArtists: Artist[] = [
  {
    id: 1,
    name: "Léo",
    genre: "rap",
    country: "france",
    description: "Rising French rap artist from Paris",
    monthlyListeners: 485000,
    fundingGoal: "100000",
    currentFunding: "75000",
    expectedReturn: "18-25%",
    riskLevel: "Medium",
    streamingLinks: {
      spotify: "https://open.spotify.com/artist/5M9FX6K3T7o3Kz3iLyC0hJ",
      youtube: "https://www.youtube.com/@leofrenchrap",
      deezer: "https://www.deezer.com/artist/leo"
    },
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Mia",
    genre: "pop",
    country: "usa",
    description: "Pop sensation from Los Angeles",
    monthlyListeners: 720000,
    fundingGoal: "100000",
    currentFunding: "60000",
    expectedReturn: "22-30%",
    riskLevel: "Medium",
    streamingLinks: {
      spotify: "https://open.spotify.com/artist/6eUKZXaKkcviHQUhycCKoQ",
      youtube: "https://www.youtube.com/@miapop",
      apple: "https://music.apple.com/artist/mia"
    },
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    isActive: true,
    createdAt: new Date(),
  },
  // Add more mock artists as needed
];
