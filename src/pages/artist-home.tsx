import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, TrendingUp, Users, DollarSign, Play, Settings, Crown, LogOut, Lock, XCircle as XCircleIcon } from "lucide-react";
import SLogo from "@/components/s-logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuthRTK";
import { useGetAllProjectsQuery } from "@/store/features/api/labelApi";
import { useGetUserProfileQuery } from "@/store/features/api/authApi";
import { Music, Calendar } from "lucide-react";
import CreateNewCampaign from "@/components/create-new-campaign";
import { useNavigate } from "react-router-dom";

export default function ArtistHome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, isLogoutLoading } = useAuth();
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);

  // Get user profile data
  const { data: profileData, isLoading: profileLoading } = useGetUserProfileQuery();

  // Get projects from API
  const { data: projectsData, isLoading: campaignsLoading, error: campaignsError } = useGetAllProjectsQuery({
    page: 1,
    limit: 3, // Only get latest 3 projects
  });

  const campaigns = projectsData?.data?.projects || [];

  // Convert campaigns to UI format for display
  const projects = campaigns.map((campaign) => ({
    id: campaign._id,
    title: campaign.title,
    status: campaign.status === 'active' ? 'Active' : 'Draft',
    raised: 0, // This would need to be calculated from actual investments
    goal: campaign.fundingGoal,
    contributors: 0, // This would need to be calculated from actual investments
    deadline: new Date(campaign.fundingDeadline).toLocaleDateString(),
    // Additional fields for the new UI
    description: campaign.description,
    songTitle: campaign.songTitle,
    artistName: campaign.artistName,
    expectedROIPercentage: campaign.expectedROIPercentage,
    duration: campaign.duration,
    releaseType: campaign.releaseType,
    isVerified: campaign.isVerified,
    createdAt: campaign.createdAt,
    image: (campaign as any).image // Add image field
  }));

  // Log for debugging (keeping original)
  useEffect(() => {
    console.log('🎯 Dashboard campaigns:', campaigns);
    console.log('🎯 Dashboard projects:', projects);
    console.log('🎯 Project images:', projects.map(p => ({ title: p.title, image: p.image })));
  }, [campaigns, projects]);
  

  // Get financial data from user profile
  const totalFundsRaised = profileData?.data?.user?.totalFundsRaised || 0;
  const totalFundingGoal = profileData?.data?.user?.totalFundingGoal || 0;
  const totalProjects = profileData?.data?.user?.totalProjects || 0;

  // Calculate average progress based on total funds raised and funding goal
  const averageProgress = totalFundingGoal > 0 ? (totalFundsRaised / totalFundingGoal) * 100 : 0;

  const quickStats = [
    { 
      label: "Total Raised", 
      value: `$${totalFundsRaised.toLocaleString()}`,
      icon: DollarSign, 
      color: "text-green-400" 
    },
    { 
      label: "Total Projects",
      value: totalProjects.toString(),
      icon: TrendingUp, 
      color: "text-blue-400" 
    },
    { 
      label: "Total Goal", 
      value: `$${totalFundingGoal.toLocaleString()}`,
      icon: Users, 
      color: "text-purple-400" 
    },
    { 
      label: "Avg Progress", 
      value: `${averageProgress.toFixed(1)}%`, 
      icon: Play, 
      color: "text-cyan-400" 
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20 relative overflow-hidden">
      {/* Solid base layer to avoid white flash on initial paint/scroll */}
      <div className="fixed inset-0 bg-[#0B0B15] z-0" />
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(122,90,248,0.1)_0%,transparent_50%)] pointer-events-none transform-gpu [will-change:transform]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none transform-gpu [will-change:transform]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none transform-gpu [will-change:transform]" />
      
      <div className="max-w-7xl mx-auto p-3 sm:p-4 space-y-6 sm:space-y-8 relative z-10">
        {/* Welcome Header */}
        <div 
          className="text-center space-y-6 pt-6 sm:pt-10 rounded-3xl mx-4 sm:mx-0 p-8 sm:p-12 relative overflow-hidden md:backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, #0B0B15 0%, #141428 70%, rgba(255,213,128,0.08) 100%)',
            border: '1px solid rgba(122, 90, 248, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 animate-pulse transform-gpu [will-change:transform,opacity]" />
          <div className="absolute top-4 right-4 w-2 h-2 bg-[#7A5AF8] rounded-full animate-ping" />
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-[#FFD580] rounded-full animate-pulse" />
          
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-6 relative z-10">
            <div className="relative">
              <SLogo className="text-[#7A5AF8] animate-neon-pulse drop-shadow-lg" size={40} />
              <div className="absolute inset-0 bg-[#7A5AF8]/20 rounded-full blur-xl animate-pulse" />
            </div>
            <Crown className="text-[#FFD580] text-2xl sm:text-3xl drop-shadow-lg animate-bounce" />
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300 px-4 leading-tight tracking-tight">
            {t('welcome').toUpperCase()} {user?.username?.toUpperCase() || 'ARTIST'}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 px-4 font-light tracking-wide">{t('creativeCockpit')}</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4 mt-8">
            <Badge 
              className="px-6 py-3 text-sm font-medium backdrop-blur-sm border-2"
              style={{
                background: 'linear-gradient(135deg, rgba(122, 90, 248, 0.2) 0%, rgba(122, 90, 248, 0.1) 100%)',
                color: '#7A5AF8',
                borderColor: 'rgba(122, 90, 248, 0.4)',
                boxShadow: '0 8px 32px rgba(122, 90, 248, 0.3)'
              }}
            >
              <Crown className="w-4 h-4 mr-2" />
              {t('artistProPlan')}
            </Badge>
            <Button
              variant="outline"
              onClick={() => logout()}
              disabled={isLogoutLoading}
              className="border-2 border-red-500/30 text-red-300 hover:bg-red-500/10 hover:border-red-500/50 text-sm px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLogoutLoading ? t('signingOut') : t('signOut')}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {profileLoading ? (
            // Loading state for all cards
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700/50 shadow-2xl backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl animate-pulse"></div>
                    <div className="w-full space-y-2">
                      <div className="h-6 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg animate-pulse"></div>
                      <div className="h-4 bg-gradient-to-r from-slate-600/50 to-slate-700/50 rounded animate-pulse w-3/4 mx-auto"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            quickStats.map((stat, index) => (
            <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 group backdrop-blur-sm hover:scale-105 hover:border-slate-600/70 relative overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="p-4 sm:p-6 relative z-10">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className={`w-6 h-6 ${stat.color} drop-shadow-lg`} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="text-center space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 group-hover:from-cyan-300 group-hover:to-blue-300 transition-all duration-300">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700/50 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 opacity-50" />
          
          <CardHeader className="pb-6 relative z-10">
            <CardTitle className="text-white flex items-center text-xl sm:text-2xl font-bold">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mr-3 shadow-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              {t('quickActions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Button 
                onClick={() => setShowNewCampaignModal(true)}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 h-20 sm:h-24 flex-col text-sm font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 border-0 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Plus className="w-6 h-6 mb-2 drop-shadow-lg" />
                {t('newCampaign')}
              </Button>
              
              <Button 
                variant="outline" 
                className="border-2 border-blue-500/40 text-blue-300 h-20 sm:h-24 flex-col hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 hover:border-blue-400/60 text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 relative overflow-hidden group" 
                onClick={() => navigate('/analytics')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <TrendingUp className="w-6 h-6 mb-2 drop-shadow-lg relative z-10" />
                <span className="relative z-10">{t('viewAnalytics')}</span>
              </Button>
              
              <Button 
                onClick={() => navigate('/settings')}
                variant="outline" 
                className="border-2 border-gray-500/40 text-gray-300 h-20 sm:h-24 flex-col hover:bg-gradient-to-r hover:from-gray-500/10 hover:to-slate-500/10 hover:border-gray-400/60 text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-slate-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Settings className="w-6 h-6 mb-2 drop-shadow-lg relative z-10" />
                <span className="relative z-10">{t('manageProfile')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700/50 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 opacity-50" />
          
          <CardHeader className="pb-6 relative z-10">
            <CardTitle className="text-white text-xl sm:text-2xl font-bold flex items-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mr-3 shadow-lg">
                <Music className="w-5 h-5 text-white" />
              </div>
              {t('activeProjects')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            {campaignsLoading ? (
              <div className="text-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/20 border-t-purple-500 mx-auto mb-6"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
                <p className="text-gray-300 text-lg font-medium">{t('loadingYourProjects')}</p>
              </div>
            ) : campaignsError ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <XCircleIcon className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-red-300 text-lg font-semibold mb-2">{t('failedToLoadProjects')}</p>
                <p className="text-gray-400 text-sm">{t('pleaseTryAgainLater')}</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Music className="w-10 h-10 text-purple-400" />
                </div>
                <p className="text-gray-300 text-lg font-semibold mb-6">{t('noActiveCampaignsYet')}</p>
                <Button 
                  onClick={() => setShowNewCampaignModal(true)}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  {t('createYourFirstCampaign')}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="p-6 bg-gradient-to-br from-slate-800/40 to-slate-700/20 rounded-2xl hover:from-slate-700/60 hover:to-slate-600/40 transition-all duration-500 group border border-slate-600/30 hover:border-cyan-500/50 shadow-2xl hover:shadow-3xl cursor-pointer relative overflow-hidden backdrop-blur-sm hover:scale-[1.02]"
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Project Image */}
                    {project.image && (
                      <div className="mb-6 overflow-hidden rounded-2xl relative group/image">
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.image}`}
                          alt={project.title}
                          className="w-full h-48 sm:h-56 object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4 relative z-10">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h4 className="text-white font-bold text-lg sm:text-xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-300 capitalize">
                            {project.title}
                          </h4>
                          <Badge
                            className={`capitalize text-sm font-medium px-3 py-1 backdrop-blur-sm border-2 ${project.status === 'Active'
                                ? 'bg-green-500/20 text-green-300 border-green-500/40 shadow-lg shadow-green-500/20'
                                : project.status === 'completed'
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-lg shadow-blue-500/20'
                                  : 'bg-gray-500/20 text-gray-300 border-gray-500/40'
                              }`}
                          >
                            {project.status}
                          </Badge>
                          {project.isVerified && (
                            <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/40 text-sm font-medium px-3 py-1 backdrop-blur-sm shadow-lg shadow-purple-500/20">
                              <Crown className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm sm:text-base mb-4 line-clamp-2 capitalize leading-relaxed">
                          {project.description}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-400">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                              <Music className="w-4 h-4 text-purple-300" />
                            </div>
                            <span className="truncate font-medium">{project.songTitle} - {project.artistName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-cyan-300" />
                            </div>
                            <span className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-10">
                      <div className="text-center p-4 bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-2xl border border-slate-600/30 backdrop-blur-sm group/stat hover:border-cyan-500/50 transition-all duration-300">
                        <p className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 group-hover:from-cyan-300 group-hover:to-blue-300 transition-all duration-300">${project.goal.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">{t('fundingGoal')}</p>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-2xl border border-slate-600/30 backdrop-blur-sm group/stat hover:border-cyan-500/50 transition-all duration-300">
                        <p className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:from-cyan-300 group-hover:to-blue-300 transition-all duration-300">{project.expectedROIPercentage}%</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">{t('expectedROI')}</p>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-2xl border border-slate-600/30 backdrop-blur-sm group/stat hover:border-purple-500/50 transition-all duration-300">
                        <p className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">{project.duration} {t('days')}</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">{t('duration')}</p>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-2xl border border-slate-600/30 backdrop-blur-sm group/stat hover:border-orange-500/50 transition-all duration-300">
                        <p className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 group-hover:from-orange-300 group-hover:to-yellow-300 transition-all duration-300 capitalize">{project.releaseType}</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">{t('releaseType')}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-600/30 relative z-10">
                      <div className="text-sm text-gray-400 space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                          <span className="font-medium">{t('deadline')}: {project.deadline}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                          <span className="font-medium">{t('created')}: {new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!campaignsLoading && (
              (user as any)?.isProMember ? (
                <Button 
                  onClick={() => setShowNewCampaignModal(true)}
                  variant="outline" 
                  className="w-full border-2 border-dashed border-purple-500/50 text-purple-300 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:border-purple-400/70 py-6 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  {t('createNewProject')}
                </Button>
              ) : (
                <div className="w-full p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-2 border-slate-600/50 rounded-2xl text-center backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-600/50 to-gray-700/50 rounded-2xl flex items-center justify-center mr-3">
                        <Lock className="w-6 h-6 text-gray-400" />
                      </div>
                      <span className="text-gray-300 text-lg font-semibold">{t('proRequired')}</span>
                    </div>
                    <p className="text-gray-400 text-base mb-6 leading-relaxed">
                      {t('upgradeToProToCreate')}
                    </p>
                    <Button 
                      onClick={() => navigate('/settings')}
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                    >
                      <Crown className="w-5 h-5 mr-3" />
                      {t('upgradeToPro')}
                    </Button>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {/* <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                  <div>
                    <div className="text-white font-medium">{activity.action}</div>
                    <div className="text-gray-400 text-sm">{activity.detail}</div>
                  </div>
                  <div className="text-gray-500 text-sm">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Artist Dashboard Integration */}
        {/* <div className="bg-slate-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-purple-400" />
            Professional Dashboard
          </h2>
          <ArtistDashboard 
            isArtistUser={true}
            onUpgrade={() => {}}
          />
        </div> */}
      </div>

      {/* Professional Inbox Modal */}
      {/* {showProfessionalInbox && (
        <ProfessionalInbox onClose={() => setShowProfessionalInbox(false)} />
      )} */}

      {/* New Campaign Modal */}
      {showNewCampaignModal && (
          <CreateNewCampaign onClose={() => setShowNewCampaignModal(false)} />
      )}

      {/* Artist Profile Page - Full Screen */}
      {/* {showProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900">
          <ArtistProfilePage
            artist={{
              id: user?.id || 1,
              name: user?.username || "Artist Name",
              genre: "pop",
              country: "france",
              monthlyListeners: 425000,
              fundingGoal: "50000",
              currentFunding: "32500",
              expectedReturn: "15-25%",
              riskLevel: "Medium",
              streamingLinks: { spotify: "#", youtube: "#" },
              imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
              isActive: true,
              createdAt: new Date(),
              description: "Rising artist creating innovative music"
            }}
            onBack={() => setShowProfile(false)}
            onMessage={() => {}}
            onInvest={() => {}}
            onFollow={() => {}}
            isOwner={true} // Artist viewing their own profile
          />
        </div>
      )} */}
    </div>
  );
}
