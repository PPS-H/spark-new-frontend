import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  TrendingUp,
  Play,
  Menu,
  Moon,
  BarChart3,
  Search,
} from "lucide-react";
import SLogo from "@/components/s-logo";
import {
  SiSpotify,
  SiApplemusic,
  SiYoutube,
  SiInstagram,
  SiTiktok,
  SiSoundcloud,
} from "react-icons/si";
import { useAuth } from "@/hooks/useAuthRTK";
import ArtistProfilePage from "@/components/artist-profile-page";
import InvestmentModal from "@/components/investment-modal";
import { useGetFeaturedArtistsQuery, useLikeDislikeArtistMutation, type FeaturedArtist } from "@/store/features/api/fanApi";
import type { Artist } from "@/types/artist";

// Helper function to transform API artist to UI artist
const transformApiArtistToUIArtist = (apiArtist: FeaturedArtist, index: number): Artist => {
  return {
    id: index + 1,
    name: apiArtist.username || 'Unknown Artist',
    genre: apiArtist.favoriteGenre || 'Unknown Genre',
    country: 'Unknown', // Not provided by API, using dummy data
    description: apiArtist.artistBio || 'No description available',
    monthlyListeners: Math.floor(Math.random() * 5000000) + 100000, // Dummy data
    fundingGoal: apiArtist.fundingGoal,
    currentFunding: apiArtist.currentFunding,
    expectedReturn: apiArtist.expectedReturn,
    // riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)], // Dummy data
    streamingLinks: {
      spotify: apiArtist.socialMediaLinks?.spotify,
      youtube: apiArtist.socialMediaLinks?.youtube,
      instagram: apiArtist.socialMediaLinks?.instagram,
    },
    imageUrl: apiArtist.profileImage || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&sig=${index}`, // Dummy data with index for variety
    isActive: true,
    createdAt: new Date(),
    isLiked: apiArtist.isLiked,
    artistId: apiArtist._id || '',
  };
};

export default function UserHome() {
  const { user, logout, isLogoutLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("trending");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);

  // Fetch featured artists from API
  const { 
    data: featuredArtistsResponse, 
    isLoading, 
    error 
  } = useGetFeaturedArtistsQuery({ page: 1, limit: 10 });

  // Like/Dislike artist mutation
  const [likeDislikeArtist, { isLoading: isLikeDislikeLoading }] = useLikeDislikeArtistMutation();

  // Transform API data to UI format
  const featuredArtists: Artist[] = featuredArtistsResponse?.data 
    ? featuredArtistsResponse.data.map((apiArtist, index) => 
        transformApiArtistToUIArtist(apiArtist, index)
      )
    : [];

  const handleArtistClick = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  const handleInvestClick = (artist: Artist) => {
    setSelectedArtist(artist);
    setShowInvestmentModal(true);
  };

  const handleInvestment = (amount: number, method: string) => {
    console.log(
      `Investment successful: $${amount} in ${selectedArtist?.name} via ${method}`
    );
    setShowInvestmentModal(false);
  };

  const handleFollowArtist = async (artist: Artist) => {
    if (!artist.artistId) {
      console.error("Artist ID is missing");
      return;
    }
    
    try {
      await likeDislikeArtist({ artistId: artist.artistId }).unwrap();
      console.log("Artist like/dislike toggled successfully");
    } catch (error) {
      console.error("Error toggling artist like:", error);
    }
  };

  const handleMessageArtist = (artist: Artist) => {
    // TODO: Implement messaging functionality
    console.log("Messaging artist:", artist.name);
  };

  const portfolioData = {
    totalInvested: 0,
    currentValue: 0,
    totalReturn: "0.00%",
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <SLogo className="text-cyan-400" size={24} />
          <span className="text-xl font-bold text-white">
            Welcome {user?.username}🔥🔥
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* <Button
            size="sm"
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
          >
            <Moon className="w-4 h-4" />
          </Button> */}
          <Button
            size="sm"
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-4"
            onClick={() => logout()}
            disabled={isLogoutLoading}
          >
            {isLogoutLoading ? "..." : "Logout"}
          </Button>
          {/* <Button
            size="sm"
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
          >
            <Menu className="w-4 h-4" />
          </Button> */}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Content based on active tab */}
        {activeTab === "trending" ? (
          <>
            {/* Tab Header */}
            <div>
              <h1 className="text-2xl font-bold mb-4">Featured Artists</h1>
              <div className="flex space-x-3 mb-6">
                <Button
                  size="sm"
                  className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-4"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </Button>
                {/* <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => setActiveTab("new")}
                >
                  New
                </Button> */}
              </div>
            </div>

            {/* Featured Artist Cards */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading featured artists...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-400 mb-4">Failed to load featured artists</p>
                  <p className="text-gray-500 text-sm">Please try again later</p>
                </div>
              ) : featuredArtists.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No featured artists available</p>
                </div>
              ) : (
                featuredArtists.map((artist, index) => {
                const fundingProgress = Math.round(
                  (parseFloat(artist.currentFunding) /
                    parseFloat(artist.fundingGoal)) *
                    100
                );
                const monthlyListenersFormatted =
                  (artist.monthlyListeners / 1000000).toFixed(1) + "M";

                return (
                  <Card
                    key={index}
                    className="bg-gray-900 border-gray-800 overflow-hidden"
                  >
                    <div
                      className="aspect-video relative cursor-pointer"
                      onClick={() => handleArtistClick(artist)}
                    >
                      <img
                        src={artist.imageUrl}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {artist.name}
                            </h3>
                            <p className="text-gray-300 text-sm">
                              {artist.genre} • {artist.country}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className={`border-gray-600 hover:bg-gray-700 ${
                                artist.isLiked ? 'text-red-500 border-red-500' : 'text-gray-400'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFollowArtist(artist);
                              }}
                              disabled={isLikeDislikeLoading}
                            >
                              <Heart 
                                className={`w-4 h-4 ${
                                  artist.isLiked ? 'fill-current' : ''
                                }`} 
                              />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 hover:bg-gray-700"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-4">
                      {/* Funding Progress */}
                      <div>
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                          <span>Funding Progress</span>
                          <span className="text-cyan-400 font-medium">
                            {fundingProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${fundingProgress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-gray-300">
                            ${parseInt(artist.currentFunding).toLocaleString()}{" "}
                            raised
                          </span>
                          <span className="text-gray-500">
                            ${parseInt(artist.fundingGoal).toLocaleString()}{" "}
                            goal
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">
                            Monthly Listeners
                          </p>
                          <p className="text-white font-semibold">
                            {monthlyListenersFormatted}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">
                            Expected Return
                          </p>
                          <p className="text-yellow-400 font-semibold">
                            {artist.expectedReturn}
                          </p>
                        </div>
                      </div>

                      {/* Platform Links */}
                      <div>
                        <p className="text-gray-400 text-sm mb-3">
                          Listen on platforms
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {artist.streamingLinks?.spotify && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white p-2 w-10 h-10"
                              onClick={() =>
                                window.open(
                                  artist.streamingLinks?.spotify,
                                  "_blank"
                                )
                              }
                            >
                              <SiSpotify className="w-5 h-5" />
                            </Button>
                          )}
                          {artist.streamingLinks?.apple && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-400 text-gray-400 hover:bg-gray-600 hover:text-white p-2 w-10 h-10"
                              onClick={() =>
                                window.open(
                                  artist.streamingLinks?.apple,
                                  "_blank"
                                )
                              }
                            >
                              <SiApplemusic className="w-5 h-5" />
                            </Button>
                          )}
                          {artist.streamingLinks?.youtube && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white p-2 w-10 h-10"
                              onClick={() =>
                                window.open(
                                  artist.streamingLinks?.youtube,
                                  "_blank"
                                )
                              }
                            >
                              <SiYoutube className="w-5 h-5" />
                            </Button>
                          )}
                          {artist.streamingLinks?.instagram && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white p-2 w-10 h-10"
                              onClick={() =>
                                window.open(
                                  artist.streamingLinks?.instagram,
                                  "_blank"
                                )
                              }
                            >
                              <SiInstagram className="w-5 h-5" />
                            </Button>
                          )}
                          {artist.streamingLinks?.tiktok && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-300 text-gray-300 hover:bg-gray-700 hover:text-white p-2 w-10 h-10"
                              onClick={() =>
                                window.open(
                                  artist.streamingLinks?.tiktok,
                                  "_blank"
                                )
                              }
                            >
                              <SiTiktok className="w-5 h-5" />
                            </Button>
                          )}
                          {artist.streamingLinks?.soundcloud && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white p-2 w-10 h-10"
                              onClick={() =>
                                window.open(
                                  artist.streamingLinks?.soundcloud,
                                  "_blank"
                                )
                              }
                            >
                              <SiSoundcloud className="w-5 h-5" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Investment CTA for fans */}
                      <Button
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium"
                        onClick={() => handleInvestClick(artist)}
                      >
                        💰 Invest in {artist.name}
                      </Button>
                    </CardContent>
                  </Card>
                );
                })
              )}
            </div>
          </>
        ) : activeTab === "dashboard" ? (
          <>
            {/* Investment Dashboard for Fans */}
            <div>
              <h1 className="text-2xl font-bold text-cyan-400 mb-2">
                Your Investment Dashboard
              </h1>
              <p className="text-gray-400 mb-6">
                Track your music investments and discoveries
              </p>

              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Portfolio Overview
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <span className="text-gray-300">Total Invested</span>
                      <span className="text-white font-bold">
                        ${portfolioData.totalInvested}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <span className="text-gray-300">Current Value</span>
                      <span className="text-white font-bold">
                        ${portfolioData.currentValue}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <span className="text-gray-300">Total Return</span>
                      <span className="text-green-400 font-bold">
                        +{portfolioData.totalReturn}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Recent Investments
                  </h3>
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No investments yet</p>
                    <p className="text-gray-500 text-sm">
                      Start following artists to begin your journey
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === "discover" ? (
          <>
            {/* Discovery Page - Spotify Style */}
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Que souhaitez-vous écouter ?"
                  className="w-full bg-white text-black rounded-xl px-12 py-4 text-base font-medium shadow-lg"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Main Navigation Categories */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  Commencer la navigation
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-xl p-6 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl">
                    <h3 className="text-white font-bold text-lg z-10 relative">
                      Musique
                    </h3>
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 opacity-80">
                      <img
                        src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face"
                        alt="Music"
                        className="w-full h-full object-cover rounded-lg transform rotate-12 shadow-lg"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-teal-600 to-green-600 rounded-xl p-6 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl">
                    <h3 className="text-white font-bold text-lg z-10 relative">
                      Podcasts
                    </h3>
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 opacity-80">
                      <img
                        src="https://images.unsplash.com/photo-1516575080321-4a8d13461c2e?w=400&h=400&fit=crop&crop=face"
                        alt="Podcasts"
                        className="w-full h-full object-cover rounded-lg transform rotate-12 shadow-lg"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl">
                    <h3 className="text-white font-bold text-lg z-10 relative">
                      Livres audio
                    </h3>
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 opacity-80">
                      <img
                        src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop&crop=face"
                        alt="Audio Books"
                        className="w-full h-full object-cover rounded-lg transform rotate-12 shadow-lg"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl">
                    <h3 className="text-white font-bold text-lg z-10 relative">
                      Événements live
                    </h3>
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 opacity-80">
                      <img
                        src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=400&fit=crop&crop=center"
                        alt="Live Events"
                        className="w-full h-full object-cover rounded-lg transform rotate-12 shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Discover New Horizons */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  Découvrez de nouveaux horizons
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=300&fit=crop"
                      alt="Music for You"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-600/90 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-white font-bold text-sm">
                        De la musique pour vous
                      </h3>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=300&fit=crop"
                      alt="Rap Marseillais"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/90 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-white font-bold text-sm">
                        #rap marseillais
                      </h3>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl col-span-2">
                    <img
                      src="https://images.unsplash.com/photo-1516575080321-4a8d13461c2e?w=600&h=200&fit=crop"
                      alt="Podcasts for You"
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-teal-600/90 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-white font-bold text-sm">
                        Podcasts pour vous
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Browse All Categories */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  Parcourir tout
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-4 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl h-24">
                    <h3 className="text-white font-bold text-sm z-10 relative">
                      Conçu spécialement pour vous
                    </h3>
                    <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-60">
                      <img
                        src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=face"
                        alt=""
                        className="w-full h-full object-cover rounded-lg transform rotate-12"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-teal-600 to-green-600 rounded-xl p-4 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl h-24">
                    <h3 className="text-white font-bold text-sm z-10 relative">
                      Sorties à venir
                    </h3>
                    <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-60">
                      <img
                        src="https://images.unsplash.com/photo-1516575080321-4a8d13461c2e?w=200&h=200&fit=crop&crop=face"
                        alt=""
                        className="w-full h-full object-cover rounded-lg transform rotate-12"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-600 to-yellow-600 rounded-xl p-4 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl h-24">
                    <h3 className="text-white font-bold text-sm z-10 relative">
                      Dernières sorties
                    </h3>
                    <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-60">
                      <img
                        src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop&crop=face"
                        alt=""
                        className="w-full h-full object-cover rounded-lg transform rotate-12"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl h-24">
                    <h3 className="text-white font-bold text-sm z-10 relative">
                      Été
                    </h3>
                    <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-60">
                      <img
                        src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=200&h=200&fit=crop&crop=center"
                        alt=""
                        className="w-full h-full object-cover rounded-lg transform rotate-12"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl p-4 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl h-24">
                    <h3 className="text-white font-bold text-sm z-10 relative">
                      Hip-Hop
                    </h3>
                    <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-60">
                      <img
                        src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop"
                        alt=""
                        className="w-full h-full object-cover rounded-lg transform rotate-12"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-4 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl h-24">
                    <h3 className="text-white font-bold text-sm z-10 relative">
                      Pop
                    </h3>
                    <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-60">
                      <img
                        src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=face"
                        alt=""
                        className="w-full h-full object-cover rounded-lg transform rotate-12"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-4 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl h-24">
                    <h3 className="text-white font-bold text-sm z-10 relative">
                      Variété Française
                    </h3>
                    <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-60">
                      <img
                        src="https://images.unsplash.com/photo-1516575080321-4a8d13461c2e?w=200&h=200&fit=crop&crop=face"
                        alt=""
                        className="w-full h-full object-cover rounded-lg transform rotate-12"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-4 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl h-24">
                    <h3 className="text-white font-bold text-sm z-10 relative">
                      Classements
                    </h3>
                    <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-60">
                      <img
                        src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop&crop=face"
                        alt=""
                        className="w-full h-full object-cover rounded-lg transform rotate-12"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-600 to-red-600 rounded-xl p-4 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl h-24">
                    <h3 className="text-white font-bold text-sm z-10 relative">
                      Latino
                    </h3>
                    <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-60">
                      <img
                        src="https://images.unsplash.com/photo-1516575080321-4a8d13461c2e?w=200&h=200&fit=crop&crop=face"
                        alt=""
                        className="w-full h-full object-cover rounded-lg transform rotate-12"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl p-4 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl h-24">
                    <h3 className="text-white font-bold text-sm z-10 relative">
                      Rock
                    </h3>
                    <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-60">
                      <img
                        src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop"
                        alt=""
                        className="w-full h-full object-cover rounded-lg transform rotate-12"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-4 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl h-24">
                    <h3 className="text-white font-bold text-sm z-10 relative">
                      Ambiance
                    </h3>
                    <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-60">
                      <img
                        src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=200&h=200&fit=crop&crop=center"
                        alt=""
                        className="w-full h-full object-cover rounded-lg transform rotate-12"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl p-4 relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-xl h-24">
                    <h3 className="text-white font-bold text-sm z-10 relative">
                      Radio
                    </h3>
                    <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-60">
                      <img
                        src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=face"
                        alt=""
                        className="w-full h-full object-cover rounded-lg transform rotate-12"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Default fallback - could be dashboard or other */}
            <div className="text-center py-12">
              <SLogo className="text-gray-600 mx-auto mb-4" size={64} />
              <p className="text-gray-400">Select a tab to continue</p>
            </div>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
        <div className="flex items-center justify-center space-x-12 py-3 px-4">
          <Button
            size="sm"
            variant={activeTab === "trending" ? "default" : "ghost"}
            className={
              activeTab === "trending"
                ? "bg-purple-600 hover:bg-purple-700"
                : "text-gray-400 hover:text-white"
            }
            onClick={() => setActiveTab("trending")}
          >
            <div className="flex flex-col items-center space-y-1">
              <div className="w-6 h-6 bg-current rounded-sm" />
              <span className="text-xs">Home</span>
            </div>
          </Button>

          <Button
            size="sm"
            variant={activeTab === "discover" ? "default" : "ghost"}
            className={
              activeTab === "discover"
                ? "bg-purple-600 hover:bg-purple-700"
                : "text-gray-400 hover:text-white"
            }
            onClick={() => setActiveTab("discover")}
          >
            <div className="flex flex-col items-center space-y-1">
              <Search className="w-5 h-5" />
              <span className="text-xs">Search</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Artist Profile Overlay */}
      {selectedArtist && !showInvestmentModal && (
        <div className="fixed inset-0 z-50 bg-black">
          <ArtistProfilePage
            artist={selectedArtist}
            onBack={() => setSelectedArtist(null)}
            onMessage={handleMessageArtist}
            onInvest={handleInvestClick}
            onFollow={handleFollowArtist}
            isOwner={false}
          />
        </div>
      )}

      {/* Investment Modal */}
      {selectedArtist && showInvestmentModal && (
        <InvestmentModal
          artist={selectedArtist}
          isOpen={showInvestmentModal}
          onClose={() => setShowInvestmentModal(false)}
          onInvest={handleInvestment}
        />
      )}
    </div>
  );
}
