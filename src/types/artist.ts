export interface Artist {
  id: any;
  name: string;
  genre: string;
  country: string;
  description: string;
  monthlyListeners: number;
  fundingGoal: string;
  currentFunding: string;
  expectedReturn: string;
  riskLevel?: string;
  streamingLinks?: {
    spotify?: string;
    apple?: string;
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    soundcloud?: string;
  };
  imageUrl: string;
  isActive?: boolean;
  createdAt?: Date;
  isLiked?: boolean;
  isFollowed?: boolean;
  artistId?: string;
}