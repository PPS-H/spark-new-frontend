import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20 relative overflow-hidden">
      {/* Solid base layer to avoid white flash on initial paint/scroll */}
      <div className="fixed inset-0 bg-[#0B0B15] z-0" />
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(122,90,248,0.1)_0%,transparent_50%)] pointer-events-none transform-gpu [will-change:transform]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none transform-gpu [will-change:transform]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none transform-gpu [will-change:transform]" />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 sm:space-y-10 relative z-10">
        {/* Welcome Header */}
        <div 
          className="text-center space-y-6 pt-6 sm:pt-10 rounded-3xl mx-4 sm:mx-0 p-8 sm:p-12 relative overflow-hidden md:backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, #0B0B15 0%, #141428 70%, rgba(122,90,248,0.08) 100%)',
            border: '1px solid rgba(122, 90, 248, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 animate-pulse transform-gpu [will-change:transform,opacity]" />
          <div className="absolute top-4 right-4 w-2 h-2 bg-[#7A5AF8] rounded-full animate-ping" />
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-[#FFD580] rounded-full animate-pulse" />
          
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-purple-500/30">
              <Building className="text-purple-400 text-2xl sm:text-3xl animate-pulse" />
            </div>
            <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl backdrop-blur-sm border border-yellow-500/30">
              <Crown className="text-yellow-400 text-xl sm:text-2xl" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white px-4 mb-4 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
            {t('welcome').toUpperCase()} {user?.username?.toUpperCase() || "LABEL"}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 px-4 mb-6 font-medium">
            {t('labelHQ')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
            <Badge 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: '0 8px 32px rgba(122, 90, 248, 0.3)'
              }}
            >
              {t('labelExecutive')}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              disabled={isLogoutLoading}
              className="border-purple-500/30 text-gray-300 hover:bg-red-500/20 hover:border-red-500/50 text-sm px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLogoutLoading ? t('signingOut') : t('signOut')}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {labelStats.map((stat, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="p-4 sm:p-6 relative z-10">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div 
                    className="p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      background: 'linear-gradient(135deg, rgba(122, 90, 248, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                      boxShadow: '0 8px 32px rgba(122, 90, 248, 0.2)'
                    }}
                  >
                    <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color} group-hover:drop-shadow-lg transition-all duration-300`} />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-2xl sm:text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-300 font-medium group-hover:text-gray-200 transition-colors">
                      {stat.label}
                    </p>
                    <div className="flex items-center justify-center">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${stat.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Latest Projects */}
        <Card 
          className="relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-50" />
          
          <CardHeader className="pb-6 relative z-10">
            <CardTitle className="text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center text-xl sm:text-2xl font-bold">
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl mr-3">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                {t('latestProjects')}
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
                <p className="text-gray-400">{t('loadingProjects')}</p>
              </div>
            ) : projectsError ? (
              <div className="text-center py-8">
                <p className="text-red-400 mb-2">{t('failedToLoadProjects')}</p>
                <p className="text-gray-500 text-sm">{t('pleaseTryAgainLater')}</p>
              </div>
            ) : projectsData?.data?.projects?.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">{t('noProjectsFound')}</p>
                <p className="text-gray-500 text-sm">{t('createYourFirstProject')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {projectsData?.data?.projects?.map((project) => (
                  <div
                    key={project._id}
                    className="group relative overflow-hidden p-6 bg-gradient-to-br from-slate-700/30 to-slate-600/20 rounded-2xl hover:from-slate-600/40 hover:to-slate-500/30 transition-all duration-500 border border-slate-600/20 hover:border-purple-500/40 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-[1.02] hover:-translate-y-1 backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(51, 65, 85, 0.3) 100%)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Project Image */}
                    {project.image && (
                      <div className="mb-6 overflow-hidden rounded-2xl relative">
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.image}`}
                          alt={project.title}
                          className="w-full h-48 sm:h-56 object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <h4 className="text-white font-bold text-xl sm:text-2xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300 capitalize">
                              {project.title}
                            </h4>
                            <Badge 
                              className={`capitalize text-sm px-4 py-2 rounded-full font-semibold ${
                                project.status === 'active' 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10' 
                                  : project.status === 'completed'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                              }`}
                            >
                              {project.status}
                            </Badge>
                            {project.isVerified && (
                              <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-sm px-4 py-2 rounded-full font-semibold shadow-lg shadow-purple-500/10">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-300 text-sm sm:text-base mb-4 line-clamp-2 capitalize leading-relaxed">
                            {project.description}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                                <Music className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="truncate font-medium">{project.songTitle} - {project.artistName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                                <Calendar className="w-4 h-4 text-cyan-400" />
                              </div>
                              <span className="font-medium">{new Date(project.expectedReleaseDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div 
                          className="text-center p-4 bg-gradient-to-br from-slate-800/40 to-slate-700/30 rounded-2xl border border-slate-600/20 hover:border-purple-500/30 transition-all duration-300 group"
                          style={{
                            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          <p className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">${project.fundingGoal.toLocaleString()}</p>
                          <p className="text-xs text-gray-400 font-medium">{t('fundingGoal')}</p>
                        </div>
                        <div 
                          className="text-center p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group"
                          style={{
                            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                            boxShadow: '0 4px 16px rgba(6, 182, 212, 0.1)'
                          }}
                        >
                          <p className="text-xl sm:text-2xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">{project.expectedROIPercentage}%</p>
                          <p className="text-xs text-gray-400 font-medium">{t('expectedROI')}</p>
                        </div>
                        <div 
                          className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group"
                          style={{
                            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                            boxShadow: '0 4px 16px rgba(147, 51, 234, 0.1)'
                          }}
                        >
                          <p className="text-xl sm:text-2xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">{project.duration} {t('days')}</p>
                          <p className="text-xs text-gray-400 font-medium">{t('duration')}</p>
                        </div>
                        <div 
                          className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-2xl border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 group"
                          style={{
                            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 179, 8, 0.1) 100%)',
                            boxShadow: '0 4px 16px rgba(249, 115, 22, 0.1)'
                          }}
                        >
                          <p className="text-xl sm:text-2xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors capitalize">{project.releaseType}</p>
                          <p className="text-xs text-gray-400 font-medium">{t('releaseType')}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-slate-600/20">
                        <div className="text-sm text-gray-400 space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <p className="font-medium">{t('deadline')}: {new Date(project.fundingDeadline).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <p className="font-medium">{t('created')}: {new Date(project.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          {(user as any)?.isProMember ? (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
                              onClick={() => navigate(`/invest/${project._id}`)}
                            >
                              {t('invest')}
                            </Button>
                          ) : (
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 rounded-full text-sm">
                                <Lock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-400 font-medium">{t('proRequired')}</span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => navigate('/settings')}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                              >
                                <Crown className="w-4 h-4 mr-2" />
                                {t('upgradeToPro')}
                              </Button>
                            </div>
                          )}
                        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            className="group relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 cursor-pointer hover:scale-105 hover:-translate-y-2 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => navigate("/search")}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardContent className="p-6 sm:p-8 text-center relative z-10">
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                  boxShadow: '0 8px 32px rgba(147, 51, 234, 0.2)'
                }}
              >
                <Search className="w-8 h-8 text-purple-400 group-hover:drop-shadow-lg transition-all duration-300" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                {t('discoverTalent')}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed group-hover:text-gray-200 transition-colors">{t('findAndScoutArtists')}</p>
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
            className="group relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 cursor-pointer hover:scale-105 hover:-translate-y-2 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => navigate("/portfolio")}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardContent className="p-6 sm:p-8 text-center relative z-10">
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                  boxShadow: '0 8px 32px rgba(6, 182, 212, 0.2)'
                }}
              >
                <Users className="w-8 h-8 text-cyan-400 group-hover:drop-shadow-lg transition-all duration-300" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                {t('manageRoster')}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed group-hover:text-gray-200 transition-colors">{t('overseeSignedArtists')}</p>
            </CardContent>
          </Card>

          <Card
            className="group relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl hover:shadow-green-500/20 transition-all duration-500 cursor-pointer hover:scale-105 hover:-translate-y-2 backdrop-blur-sm sm:col-span-2 lg:col-span-1"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => navigate("/analytics")}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardContent className="p-6 sm:p-8 text-center relative z-10">
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
                  boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2)'
                }}
              >
                <BarChart3 className="w-8 h-8 text-green-400 group-hover:drop-shadow-lg transition-all duration-300" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300">{t('analyticsTitle')}</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed group-hover:text-gray-200 transition-colors">{t('trackPerformanceMetrics')}</p>
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
