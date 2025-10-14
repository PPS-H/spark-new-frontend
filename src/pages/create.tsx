import { useNavigate, useParams } from "react-router-dom";
import ArtistProfilePage from "@/components/artist-profile-page";
import { useGetUserProfileQuery } from "@/store/features/api/authApi";
import { useAuth } from "@/hooks/useAuthRTK";
import { useTranslation } from "react-i18next";

export default function Create() {
  const { t } = useTranslation();
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-base sm:text-lg font-medium">{t('create.loadingProfile')}</p>
          <p className="text-gray-400 text-sm mt-2">{t('create.loadingWorkspace')}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t('create.errorLoadingProfile')}</h1>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">{t('create.failedToLoadProfile')}</p>
          <button 
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-sm sm:text-base font-medium w-full sm:w-auto"
          >
            {t('create.returnHome')}
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
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t('create.accessRestricted')}</h1>
        <p className="text-gray-400 mb-6 text-sm sm:text-base">{t('create.artistAccountRequired')}</p>
        <div className="space-y-3">
          <button 
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-sm sm:text-base font-medium w-full"
          >
            {t('create.returnHome')}
          </button>
          <button 
            onClick={() => navigate("/register")}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all text-sm sm:text-base font-medium w-full"
          >
            {t('create.becomeArtist')}
          </button>
        </div>
      </div>
    </div>
  );
}
