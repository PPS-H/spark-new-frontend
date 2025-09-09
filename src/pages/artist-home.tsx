import { useState, useEffect } from "react";
import { Plus, TrendingUp, Users, DollarSign, Play, Settings, Crown, LogOut, MessageCircle } from "lucide-react";
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
  const navigate = useNavigate();
  const { user, logout, isLogoutLoading } = useAuth();
  const [showProfessionalInbox, setShowProfessionalInbox] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);

  // Get user profile data
  const { data: profileData, isLoading: profileLoading, error: profileError } = useGetUserProfileQuery();

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
    createdAt: campaign.createdAt
  }));

  // Log for debugging (keeping original)
  useEffect(() => {
    console.log('🎯 Dashboard campaigns:', campaigns);
    console.log('🎯 Dashboard projects:', projects);
  }, [campaigns, projects]);


  // Get financial data from user profile
  const totalFundsRaised = profileData?.data?.user?.totalFundsRaised || 0;
  const totalFundingGoal = profileData?.data?.user?.totalFundingGoal || 0;
  const totalProjects = profileData?.data?.user?.totalProjects || 0;
  const activeCampaigns = projects.filter(project => project.status === 'Active').length;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <SLogo className="text-purple-400 animate-neon-pulse" size={48} />
            <Crown className="text-yellow-400 text-2xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            WELCOME {user?.username?.toUpperCase() || 'ARTIST'}
          </h1>
          <p className="text-xl text-gray-400">Your creative and business cockpit</p>
          <div className="flex items-center space-x-4">
            <Badge className="bg-purple-500/20 text-purple-300 px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              Artist Pro - €39.99/month
            </Badge>
            <Button
              variant="outline"
              onClick={() => logout()}
              disabled={isLogoutLoading}
              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLogoutLoading ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {profileLoading ? (
            // Loading state for all cards
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="artist-metric-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-600 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-600 rounded animate-pulse w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            quickStats.map((stat, index) => (
              <Card key={index} className="artist-metric-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Plus className="w-5 h-5 mr-2 text-cyan-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => setShowNewCampaignModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-20 flex-col"
              >
                <Plus className="w-6 h-6 mb-2" />
                New Campaign
              </Button>
              {/* <Button 
                onClick={() => setShowProfessionalInbox(true)}
                variant="outline" 
                className="border-green-500/30 text-green-300 h-20 flex-col hover:bg-green-500/10"
              >
                <MessageCircle className="w-6 h-6 mb-2" />
                Professional Inbox
              </Button> */}
              <Button variant="outline" className="border-blue-500/30 text-blue-300 h-20 flex-col" onClick={() => navigate('/analytics')}>
                <TrendingUp className="w-6 h-6 mb-2" />
                View Analytics
              </Button>
              <Button
                onClick={() => navigate('/settings')}
                variant="outline"
                className="border-gray-500/30 text-gray-300 h-20 flex-col hover:bg-gray-500/10"
              >
                <Settings className="w-6 h-6 mb-2" />
                Manage Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white">Active Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaignsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading your projects...</p>
              </div>
            ) : campaignsError ? (
              <div className="text-center py-8">
                <p className="text-red-400 mb-2">Failed to load projects</p>
                <p className="text-gray-500 text-sm">Please try again later</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No active campaigns yet</p>
                <Button
                  onClick={() => setShowNewCampaignModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-600/40 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors capitalize">
                            {project.title}
                          </h4>
                          <Badge
                            className={`capitalize text-xs ${project.status === 'Active'
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
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">${project.goal.toLocaleString()}</p>
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
                        <p>Deadline: {project.deadline}</p>
                        <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                      </div>
                      {/* <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                        >
                          View Details
                        </Button>
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!campaignsLoading && (
              <Button
                onClick={() => setShowNewCampaignModal(true)}
                variant="outline"
                className="w-full border-dashed border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Project
              </Button>
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
