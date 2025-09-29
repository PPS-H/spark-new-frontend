import { useState } from "react";
import {
  Building,
  TrendingUp,
  Users,
  Star,
  DollarSign,
  Search,
  Crown,
  LogOut,
  BarChart3,
  Calendar,
  Music,
  Target,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuthRTK";
import ProfessionalInbox from "@/components/professional-inbox";
import { useNavigate } from "react-router-dom";
import { useGetAllProjectsQuery } from "@/store/features/api/labelApi";

export default function LabelHome() {
  const { user, logout, isLogoutLoading } = useAuth();
  const [showProfessionalInbox, setShowProfessionalInbox] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Fetch projects
  const {
    data: projectsData,
    isLoading: isProjectsLoading,
    error: projectsError,
  } = useGetAllProjectsQuery({
    page: currentPage,
    limit: 10,
  });

  // Debug logging for project images
  console.log('🎯 LabelHome projects:', projectsData?.data?.projects?.map(p => ({ 
    title: p.title, 
    image: p.image 
  })));

  const labelStats = [
    {
      label: "Total Artists",
      value: "47",
      change: "+5",
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Revenue",
      value: "€125,000",
      change: "+18.2%",
      icon: DollarSign,
      color: "text-green-400",
    },
    {
      label: "Signed This Month",
      value: "3",
      change: "+1",
      icon: Star,
      color: "text-purple-400",
    },
    {
      label: "Top Charts",
      value: "12",
      change: "+4",
      icon: TrendingUp,
      color: "text-cyan-400",
    },
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div 
          className="text-center space-y-4 pt-4 sm:pt-8 rounded-2xl mx-4 sm:mx-0 p-6 sm:p-8"
          style={{
            background: 'radial-gradient(ellipse at 20% 30%, rgba(255, 107, 53, 0.4) 0%, rgba(255, 107, 53, 0.2) 30%, rgba(255, 107, 53, 0.1) 50%, rgba(0, 0, 0, 0.9) 70%, #000000 100%)'
          }}
        >
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4">
            <Building className="text-purple-400 text-2xl sm:text-3xl animate-neon-pulse" />
            <Crown className="text-yellow-400 text-xl sm:text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white px-4">
            WELCOME {user?.username?.toUpperCase() || "LABEL"}
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 px-4">
            Your label management headquarters
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm px-3 sm:px-4 py-2">
              Label Executive
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              disabled={isLogoutLoading}
              className="border-gray-500 text-gray-300 hover:bg-red-500/20 text-xs sm:text-sm px-3 sm:px-4"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              {isLogoutLoading ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {labelStats.map((stat, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600/50 shadow-lg group hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg group-hover:bg-slate-600/50 transition-colors">
                    <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400">{stat.label}</p>
                    <p className={`text-xs ${stat.color} font-medium`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Latest Projects */}
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center text-lg sm:text-xl">
                <Target className="w-5 h-5 mr-2 text-cyan-400" />
                Latest Projects/Campaigns
              </div>
              {projectsData?.pagination && projectsData.pagination.totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-500 text-gray-300 hover:bg-gray-600 text-xs sm:text-sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <span className="text-xs sm:text-sm text-gray-400">
                    {currentPage} / {projectsData.pagination.totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-500 text-gray-300 hover:bg-gray-600 text-xs sm:text-sm"
                    onClick={() => setCurrentPage(prev => Math.min(projectsData.pagination.totalPages, prev + 1))}
                    disabled={currentPage === projectsData.pagination.totalPages}
                  >
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isProjectsLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading projects...</p>
              </div>
            ) : projectsError ? (
              <div className="text-center py-8">
                <p className="text-red-400 mb-2">Failed to load projects</p>
                <p className="text-gray-500 text-sm">Please try again later</p>
              </div>
            ) : projectsData?.data?.projects?.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No projects found</p>
                <p className="text-gray-500 text-sm">Create your first project to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projectsData?.data?.projects?.map((project) => (
                  <div
                    key={project._id}
                    className="p-3 sm:p-4 bg-gradient-to-br from-slate-700/40 to-slate-600/30 rounded-lg hover:from-slate-600/50 hover:to-slate-500/40 transition-all duration-300 group border border-slate-600/30 hover:border-cyan-500/30 shadow-lg hover:shadow-xl"
                  >
                    {/* Project Image */}
                    {project.image && (
                      <div className="mb-3 sm:mb-4 overflow-hidden rounded-lg">
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.image}`}
                          alt={project.title}
                          className="w-full h-40 sm:h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="text-white font-semibold text-base sm:text-lg group-hover:text-cyan-400 transition-colors capitalize">
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
                        <p className="text-gray-300 text-xs sm:text-sm mb-3 line-clamp-2 capitalize">
                          {project.description}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Music className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="truncate">{project.songTitle} - {project.artistName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{new Date(project.expectedReleaseDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                      <div className="text-center p-2 sm:p-3 bg-slate-800/50 rounded-lg">
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">${project.fundingGoal.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Funding Goal</p>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-slate-800/50 rounded-lg">
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-400">{project.expectedROIPercentage}%</p>
                        <p className="text-xs text-gray-400">Expected ROI</p>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-slate-800/50 rounded-lg">
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-400">{project.duration} days</p>
                        <p className="text-xs text-gray-400">Duration</p>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-slate-800/50 rounded-lg">
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-400 capitalize">{project.releaseType}</p>
                        <p className="text-xs text-gray-400">Release Type</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-600/30">
                      <div className="text-xs sm:text-sm text-gray-400 space-y-1">
                        <p>Deadline: {new Date(project.fundingDeadline).toLocaleDateString()}</p>
                        <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex space-x-2">
                        {(user as any)?.isProMember ? (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                            onClick={() => navigate(`/invest/${project._id}`)}
                          >
                            Invest
                          </Button>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 px-2 py-1 bg-gray-800/50 border border-gray-600 rounded text-xs">
                              <Lock className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-400">Pro Required</span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => navigate('/settings')}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            >
                              <Crown className="w-3 h-3 mr-1" />
                              Upgrade
                            </Button>
                          </div>
                        )}
                        {/* <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-500 text-gray-300 hover:bg-gray-600"
                          onClick={() => setShowProfessionalInbox(true)}
                        >
                          Details
                        </Button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {/* <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 bg-slate-700/20 rounded-lg"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activity.type === "signing"
                        ? "bg-green-400"
                        : activity.type === "milestone"
                        ? "bg-blue-400"
                        : activity.type === "contract"
                        ? "bg-purple-400"
                        : activity.type === "promotion"
                        ? "bg-pink-400"
                        : "bg-yellow-400"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.detail}</p>
                  </div>
                  <p className="text-gray-500 text-xs">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600/50 shadow-lg group hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-purple-500/30"
            onClick={() => navigate("/search")}
          >
            <CardContent className="p-4 sm:p-6 text-center">
              <Search className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 mx-auto mb-3 sm:mb-4 group-hover:animate-pulse group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                Discover Talent
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">Find and scout new artists</p>
            </CardContent>
          </Card>

          {/* <Card
            className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600/50 shadow-lg group hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-green-500/30"
            onClick={() => setShowProfessionalInbox(true)}
          >
            <CardContent className="p-4 sm:p-6 text-center">
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-3 sm:mb-4 group-hover:animate-pulse group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                Artist Messages
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">Professional communications</p>
            </CardContent>
          </Card> */}

          <Card
            className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600/50 shadow-lg group hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-cyan-500/30"
            onClick={() => navigate("/portfolio")}
          >
            <CardContent className="p-4 sm:p-6 text-center">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 mx-auto mb-3 sm:mb-4 group-hover:animate-pulse group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Manage Roster
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">Oversee your signed artists</p>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600/50 shadow-lg group hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-green-500/30 sm:col-span-2 lg:col-span-1"
            onClick={() => navigate("/analytics")}
          >
            <CardContent className="p-4 sm:p-6 text-center">
              <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-3 sm:mb-4 group-hover:animate-pulse group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">Analytics</h3>
              <p className="text-gray-300 text-sm sm:text-base">Track performance metrics</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Professional Inbox Modal */}
      {showProfessionalInbox && (
        <ProfessionalInbox onClose={() => setShowProfessionalInbox(false)} />
      )}
    </div>
  );
}
