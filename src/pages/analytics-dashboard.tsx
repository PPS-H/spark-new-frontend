import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Activity,
  DollarSign,
  TrendingUp,
  Users,
  Heart,
  ArrowUpRight,
  RefreshCw,
  BarChart3,
  Target,
  Briefcase,
  PieChart,
  Music,
  Play,
  Image,
  FileText
} from "lucide-react";
import { useAuth } from "@/hooks/useAuthRTK";
import { useGetAnalyticsQuery } from "@/store/features/api/analyticsApi";
import { useTranslation } from "react-i18next";

interface AnalyticsData {
  // Main metrics
  totalRevenue: number;
  totalEngagement: number;
  followers: number;
  likes: number;
  
  // Artist specific
  totalProjects: number;
  totalFundsRaised: number;
  totalFundingGoal: number;
  monthlyROI: number;
  totalInvestors: number;
  activeProjects: number;
  draftProjects: number;
  
  // Label specific
  totalInvestments: number;
  totalInvestedAmount: number;
  averageReturn: number;
  activeInvestments: number;
  completedInvestments: number;
  cancelledInvestments: number;
  
  // Content breakdown
  contentBreakdown: {
    audio: { percentage: number; count: number };
    video: { percentage: number; count: number };
    image: { percentage: number; count: number };
  };
  
  // Revenue breakdown by source
  revenueBreakdown: {
    spotify: { percentage: number; amount: number };
    youtube: { percentage: number; amount: number };
  };
  
  // Project status breakdown
  projectStatusBreakdown: {
    active: { percentage: number; count: number };
    draft: { percentage: number; count: number };
  };
  
  // Investment status breakdown
  investmentStatusBreakdown: {
    active: { percentage: number; count: number };
    completed: { percentage: number; count: number };
    cancelled: { percentage: number; count: number };
  };
}

export function AnalyticsDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalEngagement: 0,
    followers: 0,
    likes: 0,
    totalProjects: 0,
    totalFundsRaised: 0,
    totalFundingGoal: 0,
    monthlyROI: 0,
    totalInvestors: 0,
    activeProjects: 0,
    draftProjects: 0,
    totalInvestments: 0,
    totalInvestedAmount: 0,
    averageReturn: 0,
    activeInvestments: 0,
    completedInvestments: 0,
    cancelledInvestments: 0,
    contentBreakdown: {
      audio: { percentage: 0, count: 0 },
      video: { percentage: 0, count: 0 },
      image: { percentage: 0, count: 0 }
    },
    revenueBreakdown: {
      spotify: { percentage: 0, amount: 0 },
      youtube: { percentage: 0, amount: 0 }
    },
    projectStatusBreakdown: {
      active: { percentage: 0, count: 0 },
      draft: { percentage: 0, count: 0 }
    },
    investmentStatusBreakdown: {
      active: { percentage: 0, count: 0 },
      completed: { percentage: 0, count: 0 },
      cancelled: { percentage: 0, count: 0 }
    }
  });
  // Fetch analytics data from API
  const { data: analyticsResponse, isLoading: analyticsLoading } = useGetAnalyticsQuery();

  // Update analytics data when API response is received
  useEffect(() => {
    if (analyticsResponse?.data) {
      setAnalyticsData(analyticsResponse.data);
    }
  }, [analyticsResponse]);

  const formatNumber = (num: number) => 
    new Intl.NumberFormat('en-US').format(num);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

  const getRoleTitle = () => {
    switch (user?.role) {
      case 'artist': return t('analytics.artistAnalytics');
      case 'label': return t('analytics.labelAnalytics');
      default: return t('analytics.analyticsDashboard');
    }
  };

  const getContentTypeData = () => {
    return [
      { 
        type: t('analytics.audio'), 
        percentage: analyticsData.contentBreakdown.audio.percentage, 
        count: analyticsData.contentBreakdown.audio.count,
        color: 'bg-pink-500',
        textColor: 'text-pink-400',
        icon: Music
      },
      { 
        type: t('analytics.video'), 
        percentage: analyticsData.contentBreakdown.video.percentage, 
        count: analyticsData.contentBreakdown.video.count,
        color: 'bg-purple-500',
        textColor: 'text-purple-400',
        icon: Play
      },
      { 
        type: t('analytics.images'), 
        percentage: analyticsData.contentBreakdown.image.percentage, 
        count: analyticsData.contentBreakdown.image.count,
        color: 'bg-blue-500',
        textColor: 'text-blue-400',
        icon: Image
      }
    ];
  };

  const getRevenueData = () => {
    return [
      { 
        type: 'Spotify', 
        percentage: analyticsData.revenueBreakdown.spotify.percentage, 
        amount: analyticsData.revenueBreakdown.spotify.amount,
        color: 'bg-green-500',
        textColor: 'text-green-400'
      },
      { 
        type: 'YouTube', 
        percentage: analyticsData.revenueBreakdown.youtube.percentage, 
        amount: analyticsData.revenueBreakdown.youtube.amount,
        color: 'bg-red-500',
        textColor: 'text-red-400'
      }
    ];
  };

  if (analyticsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center">
        {/* Solid base layer to avoid white flash on initial paint/scroll */}
        <div className="fixed inset-0 bg-[#0B0B15] z-0" />
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(122,90,248,0.1)_0%,transparent_50%)] pointer-events-none transform-gpu [will-change:transform]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none transform-gpu [will-change:transform]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none transform-gpu [will-change:transform]" />
        
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-spin"></div>
              <div className="absolute inset-1 bg-slate-900 rounded-full flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              {t('analytics.loadingAnalytics')}
            </h3>
            <p className="text-gray-400 text-lg">Preparing your analytics dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Solid base layer to avoid white flash on initial paint/scroll */}
      <div className="fixed inset-0 bg-[#0B0B15] z-0" />
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(122,90,248,0.1)_0%,transparent_50%)] pointer-events-none transform-gpu [will-change:transform]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none transform-gpu [will-change:transform]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none transform-gpu [will-change:transform]" />
      
      <div className="p-4 sm:p-6 max-w-7xl mx-auto relative z-10">
        {/* Premium Header */}
        <div 
          className="mb-8 rounded-3xl mx-4 sm:mx-0 p-8 sm:p-12 relative overflow-hidden md:backdrop-blur-sm"
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
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-purple-500/30">
                  <BarChart3 className="text-purple-400 text-2xl sm:text-3xl" />
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                  {getRoleTitle()}
                </h1>
              </div>
              <p className="text-lg sm:text-xl text-gray-300 font-medium">
                {user?.role === 'artist' 
                  ? t('analytics.artistDescription') 
                  : t('analytics.labelDescription')
                }
              </p>
            </div>
            {/* <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-2 text-cyan-400 border-cyan-400 px-4 py-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                Live Data
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-slate-300 border-slate-600 hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div> */}
          </div>

        </div>

        {/* Additional Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl backdrop-blur-sm hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-semibold mb-2">{t('analytics.totalContent')}</p>
                  <p className="text-3xl font-bold text-white bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    {formatNumber(
                      analyticsData.contentBreakdown.audio.count +
                      analyticsData.contentBreakdown.video.count +
                      analyticsData.contentBreakdown.image.count
                    )}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                  <FileText className="h-8 w-8 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl backdrop-blur-sm hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-semibold mb-2">{t('analytics.avgEngagement')}</p>
                  <p className="text-3xl font-bold text-white bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                    {analyticsData.totalEngagement.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                  <Activity className="h-8 w-8 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl backdrop-blur-sm hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-semibold mb-2">{t('analytics.growthRate')}</p>
                  <p className="text-3xl font-bold text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    +12.5%
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl backdrop-blur-sm hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-semibold mb-2">{t('analytics.activeProjectsOrInvestments')}</p>
                  <p className="text-3xl font-bold text-white bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                    {user?.role === 'artist' ? analyticsData.totalProjects : analyticsData.activeInvestments}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl">
                  {user?.role === 'artist' ? (
                    <Target className="h-8 w-8 text-orange-400" />
                  ) : (
                    <Briefcase className="h-8 w-8 text-orange-400" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Overview Card */}
          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl backdrop-blur-sm lg:col-span-2"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-50" />
            
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                    {formatCurrency(analyticsData.totalRevenue)}
                  </h2>
                  <p className="text-gray-300 text-lg font-semibold">{t('analytics.totalRevenue')}</p>
                </div>
                
                {/* Revenue Breakdown Pie Chart */}
                <div className="flex items-center gap-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      {getRevenueData().map((item, index) => {
                        const startAngle = getRevenueData().slice(0, index).reduce((sum, prev) => sum + prev.percentage, 0);
                        const circumference = 2 * Math.PI * 15.9155;
                        const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                        const strokeDashoffset = `-${(startAngle / 100) * circumference}`;
                        
                        return (
                          <path
                            key={index}
                            className={item.color.replace('bg-', 'text-')}
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {analyticsData.revenueBreakdown.spotify.percentage}%
                        </div>
                        <div className="text-xs text-slate-400">Spotify</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(analyticsData.revenueBreakdown.spotify.amount)}
                    </div>
                    <div className="text-sm text-green-400 mb-2">Spotify</div>
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(analyticsData.revenueBreakdown.youtube.amount)}
                    </div>
                    <div className="text-sm text-red-400">YouTube</div>
                  </div>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {analyticsData.totalEngagement.toFixed(1)}%
                  </h3>
                  <p className="text-slate-400">{t('analytics.engagementRate')}</p>
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-sm font-semibold flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    +12.5%
                  </div>
                  <p className="text-slate-400 text-sm">{t('analytics.vsLastPeriod')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Card */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                {t('analytics.keyMetrics')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {user?.role === 'artist' ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-8 w-8 text-cyan-400" />
                      <div>
                        <p className="text-white font-medium">{t('analytics.projects')}</p>
                        <p className="text-slate-400 text-sm">{t('analytics.activeCampaigns')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{analyticsData.totalProjects}</p>
                      <p className="text-green-400 text-sm">{t('analytics.plus2ThisMonth')}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-green-400" />
                      <div>
                        <p className="text-white font-medium">{t('analytics.fundsRaised')}</p>
                        <p className="text-slate-400 text-sm">{t('analytics.totalFunding')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{formatCurrency(analyticsData.totalFundsRaised)}</p>
                      <p className="text-green-400 text-sm">{t('analytics.plus15_3Percent')}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">{t('analytics.monthlyROI')}</p>
                        <p className="text-slate-400 text-sm">{t('analytics.expectedReturn')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{analyticsData.monthlyROI.toFixed(1)}%</p>
                      <p className="text-green-400 text-sm">{t('analytics.plus1_2Percent')}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-8 w-8 text-cyan-400" />
                      <div>
                        <p className="text-white font-medium">{t('analytics.investments')}</p>
                        <p className="text-slate-400 text-sm">{t('analytics.portfolioSize')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{analyticsData.totalInvestments}</p>
                      <p className="text-green-400 text-sm">{t('analytics.plus3ThisMonth')}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-green-400" />
                      <div>
                        <p className="text-white font-medium">{t('analytics.totalInvested')}</p>
                        <p className="text-slate-400 text-sm">{t('analytics.portfolioValue')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{formatCurrency(analyticsData.totalInvestedAmount)}</p>
                      <p className="text-green-400 text-sm">{t('analytics.plus8_7Percent')}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">{t('analytics.avgReturn')}</p>
                        <p className="text-slate-400 text-sm">{t('analytics.portfolioPerformance')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{analyticsData.averageReturn.toFixed(1)}%</p>
                      <p className="text-green-400 text-sm">{t('analytics.plus0_8Percent')}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Content Type Analysis */}
        <Card 
          className="group relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl backdrop-blur-sm mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-50" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-white text-2xl font-bold flex items-center">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl mr-3">
                <PieChart className="w-6 h-6 text-purple-400" />
              </div>
              {t('analytics.contentPerformance')}
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg font-medium">
              {t('analytics.breakdownByContentType')}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            {/* Content Type Breakdown */}
            <div className="space-y-6">
              {getContentTypeData().map((content, index) => {
                const IconComponent = content.icon;
                return (
                  <div key={index} className="p-4 rounded-2xl bg-gradient-to-r from-slate-800/30 to-slate-700/20 border border-slate-600/20 hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${content.color} shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-white font-semibold text-lg">{content.type}</span>
                      </div>
                      <span className="text-white font-bold text-xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        {content.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative mb-3">
                      <Progress 
                        value={content.percentage} 
                        className="h-4 bg-slate-700/50 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center">
                        <div 
                          className={`h-full ${content.color} rounded-full shadow-lg`}
                          style={{ width: `${content.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 font-medium">
                      {formatNumber(content.count)} {t('analytics.items')}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Project/Investment Status Analysis */}
        {user?.role === 'artist' ? (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Target className="h-5 w-5 text-cyan-400" />
                {t('analytics.projectStatusBreakdown')}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t('analytics.distributionOfProjectsByStatus')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-green-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={`${analyticsData.projectStatusBreakdown.active.percentage}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-orange-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={`${analyticsData.projectStatusBreakdown.draft.percentage}, 100`}
                      strokeDashoffset={`-${analyticsData.projectStatusBreakdown.active.percentage}`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {analyticsData.projectStatusBreakdown.active.percentage}%
                      </div>
                      <div className="text-sm text-slate-400">{t('analytics.active')}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <div>
                      <div className="text-white font-medium">{t('analytics.activeProjects')}</div>
                      <div className="text-slate-400 text-sm">{analyticsData.projectStatusBreakdown.active.count} {t('analytics.projects')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                    <div>
                      <div className="text-white font-medium">{t('analytics.draftProjects')}</div>
                      <div className="text-slate-400 text-sm">{analyticsData.projectStatusBreakdown.draft.count} {t('analytics.projects')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-cyan-400" />
                {t('analytics.investmentStatusBreakdown')}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t('analytics.distributionOfInvestmentsByStatus')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-green-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={`${analyticsData.investmentStatusBreakdown.active.percentage}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={`${analyticsData.investmentStatusBreakdown.completed.percentage}, 100`}
                      strokeDashoffset={`-${analyticsData.investmentStatusBreakdown.active.percentage}`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-red-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={`${analyticsData.investmentStatusBreakdown.cancelled.percentage}, 100`}
                      strokeDashoffset={`-${analyticsData.investmentStatusBreakdown.active.percentage + analyticsData.investmentStatusBreakdown.completed.percentage}`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {analyticsData.investmentStatusBreakdown.active.percentage}%
                      </div>
                      <div className="text-sm text-slate-400">{t('analytics.active')}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <div>
                      <div className="text-white font-medium">{t('analytics.activeInvestments')}</div>
                      <div className="text-slate-400 text-sm">{analyticsData.investmentStatusBreakdown.active.count} {t('analytics.investments')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <div>
                      <div className="text-white font-medium">{t('analytics.completed')}</div>
                      <div className="text-slate-400 text-sm">{analyticsData.investmentStatusBreakdown.completed.count} {t('analytics.investments')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <div>
                      <div className="text-white font-medium">{t('analytics.cancelled')}</div>
                      <div className="text-slate-400 text-sm">{analyticsData.investmentStatusBreakdown.cancelled.count} {t('analytics.investments')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Revenue and Engagement Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Breakdown Pie Chart */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5 text-cyan-400" />
                {t('analytics.revenueBreakdown')}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t('analytics.revenueSourcesDistribution')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
                    {getRevenueData().map((item, index) => {
                      const startAngle = getRevenueData().slice(0, index).reduce((sum, prev) => sum + prev.percentage, 0);
                      const circumference = 2 * Math.PI * 15.9155;
                      const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                      const strokeDashoffset = `-${(startAngle / 100) * circumference}`;
                      
                      return (
                        <path
                          key={index}
                          className={item.color.replace('bg-', 'text-')}
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      );
                    })}
                  </svg>
                </div>
                <div className="space-y-3">
                  {getRevenueData().map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                      <div>
                        <div className="text-white font-medium">{item.type}</div>
                        <div className="text-slate-400 text-sm">{formatCurrency(item.amount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                {t('analytics.engagementMetrics')}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t('analytics.fanInteractionAndReach')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.likes)}</p>
                  <p className="text-slate-400 text-sm">{t('analytics.totalLikes')}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.followers)}</p>
                  <p className="text-slate-400 text-sm">{t('analytics.followers')}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{analyticsData.totalEngagement.toFixed(1)}%</p>
                  <p className="text-slate-400 text-sm">{t('analytics.engagementRate')}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{formatCurrency(analyticsData.totalRevenue)}</p>
                  <p className="text-slate-400 text-sm">{t('analytics.totalRevenue')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
      {/* Bottom padding to prevent content from hiding behind navigation bar */}
      <div className="h-20"></div>
    </div>
  );
}
