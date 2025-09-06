import { useState, useEffect } from "react";
import { Plus, TrendingUp, Users, DollarSign, Play, Upload, Settings, Crown, LogOut, MessageCircle, X } from "lucide-react";
import SLogo from "@/components/s-logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuthRTK";
import ArtistDashboard from "@/components/artist-dashboard";
import ProfessionalInbox from "@/components/professional-inbox";
import ArtistProfilePage from "@/components/artist-profile-page";
import CreateNewCampaign from "@/components/create-new-campaign";
export default function ArtistHome() {
  const { user, logout, isLogoutLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showProfessionalInbox, setShowProfessionalInbox] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [campaignDuration, setCampaignDuration] = useState("");

  // Mock campaigns data (replacing useQuery API call)
  const mockCampaigns = [
    {
      id: 1,
      title: "Summer Vibes EP",
      status: "active",
      currentFunding: "32500",
      fundingGoal: "50000",
      maxInvestmentDuration: "45"
    },
    {
      id: 2,
      title: "World Tour 2024",
      status: "active",
      currentFunding: "18000",
      fundingGoal: "75000",
      maxInvestmentDuration: "60"
    },
    {
      id: 3,
      title: "New Album Production",
      status: "draft",
      currentFunding: "0",
      fundingGoal: "100000",
      maxInvestmentDuration: "90"
    }
  ];

  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const campaignsLoading = false; // Mock loading state

  // Convert campaigns to UI format (keeping original logic)
  const projects = campaigns.map((campaign) => ({
    id: campaign.id,
    title: campaign.title,
    status: campaign.status === 'active' ? 'Active' : 'Draft',
    raised: parseFloat(campaign.currentFunding),
    goal: parseFloat(campaign.fundingGoal),
    contributors: Math.floor(Math.random() * 50) + 10, // Mock contributors
    deadline: `${campaign.maxInvestmentDuration} days duration`
  }));

  // Log for debugging (keeping original)
  useEffect(() => {
    console.log('🎯 Dashboard campaigns:', campaigns);
    console.log('🎯 Dashboard projects:', projects);
  }, [campaigns, projects]);
  
  const handleCreateCampaign = async () => {
    if (!campaignTitle || !fundingGoal || !campaignDescription || !campaignDuration) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newCampaign = {
        id: campaigns.length + 1,
        title: campaignTitle,
        status: "draft",
        currentFunding: "0",
        fundingGoal: fundingGoal,
        maxInvestmentDuration: campaignDuration
      };

      console.log("✅ Campagne créée :", newCampaign);
      
      // Update campaigns state
      setCampaigns(prev => [...prev, newCampaign]);
      
      // Trigger custom event (keeping original)
      window.dispatchEvent(new CustomEvent('campaignCreated', { 
        detail: newCampaign 
      }));
      
      setCampaignTitle("");
      setFundingGoal("");
      setCampaignDescription("");
      setCampaignDuration("");
      setShowNewCampaignModal(false);

      alert("Campaign created successfully!");
    } catch (error) {
      console.error("❌ Erreur lors de la création :", error);
      alert("Erreur lors de la création de la campagne.");
    }
  };

  // Calculate real-time stats based on campaigns (keeping original logic)
  const totalRaised = projects.reduce((sum, project) => sum + project.raised, 0);
  const activeCampaigns = projects.filter(project => project.status === 'Active').length;
  const totalGoal = projects.reduce((sum, project) => sum + project.goal, 0);
  const averageProgress = projects.length > 0 ? (totalRaised / totalGoal) * 100 : 0;

  const quickStats = [
    { 
      label: "Total Raised", 
      value: `€${totalRaised.toLocaleString()}`, 
      icon: DollarSign, 
      color: "text-green-400" 
    },
    { 
      label: "Active Campaigns", 
      value: activeCampaigns.toString(), 
      icon: TrendingUp, 
      color: "text-blue-400" 
    },
    { 
      label: "Total Goal", 
      value: `€${totalGoal.toLocaleString()}`, 
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

  const recentActivity = [
    { action: "New contribution", detail: "€150 from Luna S.", time: "2 hours ago" },
    { action: "Stream milestone", detail: "50K streams reached", time: "1 day ago" },
    { action: "Campaign update", detail: "Summer Vibes EP 60% funded", time: "2 days ago" }
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
            WELCOME {user?.firstName?.toUpperCase() || 'ARTIST'}
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
          {quickStats.map((stat, index) => (
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
          ))}
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
              <Button 
                onClick={() => setShowProfessionalInbox(true)}
                variant="outline" 
                className="border-green-500/30 text-green-300 h-20 flex-col hover:bg-green-500/10"
              >
                <MessageCircle className="w-6 h-6 mb-2" />
                Professional Inbox
              </Button>
              <Button variant="outline" className="border-blue-500/30 text-blue-300 h-20 flex-col">
                <TrendingUp className="w-6 h-6 mb-2" />
                View Analytics
              </Button>
              <Button 
                onClick={() => setShowProfile(true)}
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
                <p className="text-gray-400">Loading your campaigns...</p>
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
              projects.map((project) => (
              <div key={project.id} className="bg-slate-800/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">{project.title}</h3>
                  <Badge className={`${
                    project.status === 'Active' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {project.status}
                  </Badge>
                </div>
                
                {project.status === 'Active' ? (
                  <>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span>€{project.raised.toLocaleString()} raised</span>
                      <span>€{project.goal.toLocaleString()} goal</span>
                    </div>
                    <Progress 
                      value={(project.raised / project.goal) * 100} 
                      className="mb-3"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{project.contributors} contributors</span>
                      <span className="text-cyan-400">{project.deadline}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Ready to publish</span>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500"
                      onClick={() => {
                        // Mock launching campaign
                        setCampaigns(prev => prev.map(c => 
                          c.id === project.id 
                            ? { ...c, status: 'active' }
                            : c
                        ));
                        alert(`Campaign "${project.title}" launched successfully!`);
                      }}
                    >
                      Launch Campaign
                    </Button>
                  </div>
                )}
              </div>
              ))
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
        <Card className="artist-metric-card">
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
        </Card>

        {/* Artist Dashboard Integration */}
        <div className="bg-slate-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-purple-400" />
            Professional Dashboard
          </h2>
          <ArtistDashboard 
            isArtistUser={true}
            onUpgrade={() => {}}
          />
        </div>
      </div>

      {/* Professional Inbox Modal */}
      {showProfessionalInbox && (
        <ProfessionalInbox onClose={() => setShowProfessionalInbox(false)} />
      )}

      {/* New Campaign Modal */}
      {showNewCampaignModal && (
          <CreateNewCampaign onClose={() => setShowNewCampaignModal(false)} />
      )}

      {/* Artist Profile Page - Full Screen */}
      {showProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900">
          <ArtistProfilePage
            artist={{
              id: user?.id || 1,
              name: user?.firstName || "Artist Name",
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
      )}
    </div>
  );
}
