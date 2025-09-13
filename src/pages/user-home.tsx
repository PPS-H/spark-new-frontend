import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  BarChart3,
  Search,
  Target,
  Music,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SLogo from "@/components/s-logo";
import { useAuth } from "@/hooks/useAuthRTK";
import { useGetAllProjectsQuery } from "@/store/features/api/labelApi";


export default function UserHome() {
  const { user, logout, isLogoutLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("trending");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch projects from API
  const {
    data: projectsData,
    isLoading,
    error,
  } = useGetAllProjectsQuery({
    page: currentPage,
    limit: 10,
  });

  // Debug logging for project images
  console.log('🎯 UserHome projects:', projectsData?.data?.projects?.map(p => ({ 
    title: p.title, 
    image: p.image 
  })));

  const handleInvestClick = (projectId: string) => {
    // Navigate to invest page
    window.location.href = `/invest/${projectId}`;
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
          <Button
            size="sm"
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xlmedium px-4"
            onClick={() => logout()}
            disabled={isLogoutLoading}
          >
            {isLogoutLoading ? "..." : "Logout"}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Content based on active tab */}
        {activeTab === "trending" ? (
          <>
            {/* Tab Header */}
            <div>
              <h1 className="text-2xl font-bold mb-4">Active Projects</h1>
              <div className="flex space-x-3 mb-6">
                <Button
                  size="sm"
                  className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-4"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </Button>
              </div>
            </div>

            {/* Projects Section */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-cyan-400" />
                    Latest Projects/Campaigns
                  </div>
                  {projectsData?.pagination && projectsData.pagination.totalPages > 1 && (
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-500 text-gray-300 hover:bg-gray-600"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-400">
                        {currentPage} / {projectsData.pagination.totalPages}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-500 text-gray-300 hover:bg-gray-600"
                        onClick={() => setCurrentPage(prev => Math.min(projectsData.pagination.totalPages, prev + 1))}
                        disabled={currentPage === projectsData.pagination.totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading projects...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-400 mb-2">Failed to load projects</p>
                    <p className="text-gray-500 text-sm">Please try again later</p>
                  </div>
                ) : projectsData?.data?.projects?.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">No projects found</p>
                    <p className="text-gray-500 text-sm">Check back later for new investment opportunities</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projectsData?.data?.projects?.map((project) => (
                      <div
                        key={project._id}
                        className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-600/40 transition-all duration-300 group"
                      >
                        {/* Project Image */}
                        {project.image && (
                          <div className="mb-4">
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.image}`}
                              alt={project.title}
                              className="w-full h-48 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors capitalize">
                                {project.title}
                              </h4>
                              <Badge 
                                className={`capitalize text-xs ${
                                  project.status === 'active' 
                                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                    : project.status === 'completed'
                                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                    : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                }`}
                              >
                                {project.status}
                              </Badge>
                              {project.isVerified && (
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2 capitalize">
                              {project.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Music className="w-4 h-4" />
                                <span>{project.songTitle} - {project.artistName}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(project.expectedReleaseDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">${project.fundingGoal.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">Funding Goal</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-cyan-400">{project.expectedROIPercentage}%</p>
                            <p className="text-xs text-gray-400">Expected ROI</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-400">{project.duration} days</p>
                            <p className="text-xs text-gray-400">Duration</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-orange-400 capitalize">{project.releaseType}</p>
                            <p className="text-xs text-gray-400">Release Type</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-400">
                            <p>Deadline: {new Date(project.fundingDeadline).toLocaleDateString()}</p>
                            <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                              onClick={() => handleInvestClick(project._id)}
                            >
                              Invest
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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

    </div>
  );
}
