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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pb-20">
      {/* Header */}
      <div 
        className="sticky top-0 z-50 backdrop-blur-md border-b border-gray-800/50"
        style={{
          background: 'radial-gradient(ellipse at 20% 30%, rgba(255, 107, 53, 0.4) 0%, rgba(255, 107, 53, 0.2) 30%, rgba(255, 107, 53, 0.1) 50%, rgba(0, 0, 0, 0.9) 70%, #000000 100%)'
        }}
      >
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
          <SLogo className="text-cyan-400" size={24} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
              <span className="text-lg sm:text-xl font-bold text-white">
                Welcome {user?.username}
          </span>
              <span className="text-2xl">🔥</span>
            </div>
        </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
          <Button
            size="sm"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium px-3 sm:px-4 py-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
            onClick={() => logout()}
            disabled={isLogoutLoading}
          >
              {isLogoutLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Logout"
              )}
          </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Content based on active tab */}
        {activeTab === "trending" ? (
          <>
            {/* Tab Header */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Active Projects
              </h1>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium px-4 py-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </Button>
              </div>
            </div>

            {/* Projects Section */}
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700/50 backdrop-blur-sm shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-cyan-400" />
                    <span className="text-lg sm:text-xl">Latest Projects/Campaigns</span>
                          </div>
                  {projectsData?.pagination && projectsData.pagination.totalPages > 1 && (
                    <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                        className="border-gray-500 text-gray-300 hover:bg-gray-600 transition-all duration-200"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                            </Button>
                      <span className="text-sm text-gray-400 px-2">
                        {currentPage} / {projectsData.pagination.totalPages}
                      </span>
                            <Button
                              size="sm"
                              variant="outline"
                        className="border-gray-500 text-gray-300 hover:bg-gray-600 transition-all duration-200"
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {projectsData?.data?.projects?.map((project) => (
                      <div
                        key={project._id}
                        className="p-4 sm:p-6 bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-xl hover:from-slate-700/60 hover:to-slate-600/40 transition-all duration-300 group border border-slate-600/30 hover:border-cyan-500/50 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        {/* Project Image */}
                        {project.image && (
                          <div className="mb-4 overflow-hidden rounded-lg">
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.image}`}
                              alt={project.title}
                              className="w-full h-48 sm:h-56 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
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
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <Music className="w-4 h-4" />
                                  <span className="truncate">{project.songTitle} - {project.artistName}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(project.expectedReleaseDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                          <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                              <p className="text-lg sm:text-xl font-bold text-white">${project.fundingGoal.toLocaleString()}</p>
                              <p className="text-xs text-gray-400">Funding Goal</p>
                            </div>
                            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                              <p className="text-lg sm:text-xl font-bold text-cyan-400">{project.expectedROIPercentage}%</p>
                              <p className="text-xs text-gray-400">Expected ROI</p>
                        </div>
                            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                              <p className="text-lg sm:text-xl font-bold text-purple-400">{project.duration} days</p>
                              <p className="text-xs text-gray-400">Duration</p>
                        </div>
                            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                              <p className="text-lg sm:text-xl font-bold text-orange-400 capitalize">{project.releaseType}</p>
                              <p className="text-xs text-gray-400">Release Type</p>
                        </div>
                      </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-600/30">
                            <div className="text-sm text-gray-400 space-y-1">
                              <p>Deadline: {new Date(project.fundingDeadline).toLocaleDateString()}</p>
                              <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                        </div>
                            <div className="flex space-x-2">
                            <Button
                              size="sm"
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium px-4 py-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                                onClick={() => handleInvestClick(project._id)}
                              >
                                Invest
                            </Button>
                            </div>
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
            <div className="space-y-6">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Your Investment Dashboard
              </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                Track your music investments and discoveries
              </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-2xl">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
                    Portfolio Overview
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-lg border border-slate-600/30 hover:border-cyan-500/30 transition-all duration-200">
                      <span className="text-gray-300 text-sm sm:text-base">Total Invested</span>
                      <span className="text-white font-bold text-lg sm:text-xl">
                        ${portfolioData.totalInvested}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-lg border border-slate-600/30 hover:border-cyan-500/30 transition-all duration-200">
                      <span className="text-gray-300 text-sm sm:text-base">Current Value</span>
                      <span className="text-white font-bold text-lg sm:text-xl">
                        ${portfolioData.currentValue}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-lg border border-slate-600/30 hover:border-green-500/30 transition-all duration-200">
                      <span className="text-gray-300 text-sm sm:text-base">Total Return</span>
                      <span className="text-green-400 font-bold text-lg sm:text-xl">
                        +{portfolioData.totalReturn}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-2xl">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                    Recent Investments
                  </h3>
                  <div className="text-center py-8 sm:py-12">
                    <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm sm:text-base">No investments yet</p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
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
            <div className="space-y-6 sm:space-y-8">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="What would you like to listen to?"
                  className="w-full bg-white text-black rounded-xl px-4 sm:px-12 py-3 sm:py-4 text-sm sm:text-base font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                />
                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
              </div>

              {/* Main Navigation Categories */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                  Start Browsing
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-xl p-4 sm:p-6 relative overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer group">
                    <h3 className="text-white font-bold text-base sm:text-lg z-10 relative group-hover:text-pink-100 transition-colors">
                      Music
                    </h3>
                    <div className="absolute -right-2 sm:-right-4 -bottom-2 sm:-bottom-4 w-16 h-16 sm:w-20 sm:h-20 opacity-80 group-hover:opacity-100 transition-opacity">
                      <img
                        src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face"
                        alt="Music"
                        className="w-full h-full object-cover rounded-lg transform rotate-12 shadow-lg group-hover:rotate-6 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-teal-600 to-green-600 rounded-xl p-4 sm:p-6 relative overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer group">
                    <h3 className="text-white font-bold text-base sm:text-lg z-10 relative group-hover:text-teal-100 transition-colors">
                      Podcasts
                    </h3>
                    <div className="absolute -right-2 sm:-right-4 -bottom-2 sm:-bottom-4 w-16 h-16 sm:w-20 sm:h-20 opacity-80 group-hover:opacity-100 transition-opacity">
                      <img
                        src="https://images.unsplash.com/photo-1516575080321-4a8d13461c2e?w=400&h=400&fit=crop&crop=face"
                        alt="Podcasts"
                        className="w-full h-full object-cover rounded-lg transform rotate-12 shadow-lg group-hover:rotate-6 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-4 sm:p-6 relative overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer group">
                    <h3 className="text-white font-bold text-base sm:text-lg z-10 relative group-hover:text-blue-100 transition-colors">
                      Audio Books
                    </h3>
                    <div className="absolute -right-2 sm:-right-4 -bottom-2 sm:-bottom-4 w-16 h-16 sm:w-20 sm:h-20 opacity-80 group-hover:opacity-100 transition-opacity">
                      <img
                        src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop&crop=face"
                        alt="Audio Books"
                        className="w-full h-full object-cover rounded-lg transform rotate-12 shadow-lg group-hover:rotate-6 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 relative overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer group">
                    <h3 className="text-white font-bold text-base sm:text-lg z-10 relative group-hover:text-purple-100 transition-colors">
                      Live Events
                    </h3>
                    <div className="absolute -right-2 sm:-right-4 -bottom-2 sm:-bottom-4 w-16 h-16 sm:w-20 sm:h-20 opacity-80 group-hover:opacity-100 transition-opacity">
                      <img
                        src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=400&fit=crop&crop=center"
                        alt="Live Events"
                        className="w-full h-full object-cover rounded-lg transform rotate-12 shadow-lg group-hover:rotate-6 transition-transform duration-300"
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
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800/50 z-40">
        <div className="flex items-center justify-center space-x-8 sm:space-x-12 py-3 px-4 max-w-md mx-auto">
          <Button
            size="sm"
            variant={activeTab === "trending" ? "default" : "ghost"}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all duration-200 ${
              activeTab === "trending"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
            onClick={() => setActiveTab("trending")}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-current rounded-sm" />
            <span className="text-xs font-medium">Home</span>
          </Button>

          <Button
            size="sm"
            variant={activeTab === "discover" ? "default" : "ghost"}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all duration-200 ${
              activeTab === "discover"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
            onClick={() => setActiveTab("discover")}
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs font-medium">Search</span>
          </Button>
        </div>
      </div>

    </div>
  );
}
