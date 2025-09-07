import { useNavigate, useParams } from "react-router-dom";
import ArtistProfilePage from "@/components/artist-profile-page";
import { useGetUserProfileQuery } from "@/store/features/api/authApi";
import { useAuth } from "@/hooks/useAuthRTK";

export default function Create() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user } = useAuth();

  // Get user profile data from API - if userId is provided, fetch that user's profile
  const { data: profileData, isLoading, error } = useGetUserProfileQuery(
    userId ? { userId } : undefined
  );

  // Determine if the current user is viewing their own profile
  const isOwnProfile = !userId || (user && user._id === profileData?.data?.user?._id);
  
  // Debug logging
  console.log('Create component - userId:', userId);
  console.log('Create component - current user:', user?._id);
  console.log('Create component - profile user:', profileData?.data?.user?._id);
  console.log('Create component - isOwnProfile:', isOwnProfile);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Error Loading Profile</h1>
          <p className="text-gray-400 mb-6">Failed to load your profile data.</p>
          <button 
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const currentUser = profileData?.data?.user;

  // Artist users get their profile page in edit mode
  if (currentUser?.role === "artist") {
    return (
      <ArtistProfilePage
        artist={{
          id: currentUser._id,
          name: currentUser.username,
          genre: currentUser.favoriteGenre || "Unknown",
          country: currentUser.country || "Unknown",
          monthlyListeners: 425000, // This could be added to the API response
          fundingGoal: currentUser.totalFundingGoal?.toString() || "0",
          currentFunding: currentUser.totalFundsRaised?.toString() || "0",
          expectedReturn: `${currentUser.monthlyROI || 0}%`,
          riskLevel: "Medium", // This could be calculated based on ROI
          streamingLinks: { 
            spotify: currentUser.spotify || "#", 
            youtube: currentUser.youtube || "#" 
          },
          imageUrl: currentUser.profilePicture 
            ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${currentUser.profilePicture}`
            : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
          isActive: true,
          createdAt: new Date(currentUser.createdAt),
          description: currentUser.artistBio || currentUser.aboutTxt || "Rising artist creating innovative music",
          isFollowed:currentUser.isFollowed
        }}
        onBack={() => navigate("/")}
        onMessage={() => {}}
        onInvest={() => {}}
        onFollow={() => {}}
        isOwner={isOwnProfile || false} // Show edit buttons only if viewing own profile
      />
    );
  }

  // Non-artist users or default fallback
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Access Restricted</h1>
        <p className="text-gray-400 mb-6">This page is only available for artist accounts.</p>
        <button 
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
