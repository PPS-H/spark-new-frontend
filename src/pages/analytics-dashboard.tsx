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
      case 'artist': return 'Artist Analytics';
      case 'label': return 'Label Analytics';
      default: return 'Analytics Dashboard';
    }
  };

  const getContentTypeData = () => {
    return [
      { 
        type: 'Audio', 
        percentage: analyticsData.contentBreakdown.audio.percentage, 
        count: analyticsData.contentBreakdown.audio.count,
        color: 'bg-pink-500',
        textColor: 'text-pink-400',
        icon: Music
      },
      { 
        type: 'Video', 
        percentage: analyticsData.contentBreakdown.video.percentage, 
        count: analyticsData.contentBreakdown.video.count,
        color: 'bg-purple-500',
        textColor: 'text-purple-400',
        icon: Play
      },
      { 
        type: 'Images', 
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
          <div>
              <h1 className="text-4xl font-bold text-white mb-2">{getRoleTitle()}</h1>
              <p className="text-slate-400 text-lg">
                {user?.role === 'artist' 
                  ? 'Track your music content performance and fan engagement' 
                  : 'Monitor your investment portfolio and content reach'
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
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Content</p>
                  <p className="text-2xl font-bold text-white">
                    {formatNumber(
                      analyticsData.contentBreakdown.audio.count +
                      analyticsData.contentBreakdown.video.count +
                      analyticsData.contentBreakdown.image.count
                    )}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Avg. Engagement</p>
                  <p className="text-2xl font-bold text-white">{analyticsData.totalEngagement.toFixed(1)}%</p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Growth Rate</p>
                  <p className="text-2xl font-bold text-white">+12.5%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Active {user?.role === 'artist' ? 'Projects' : 'Investments'}</p>
                  <p className="text-2xl font-bold text-white">
                    {user?.role === 'artist' ? analyticsData.totalProjects : analyticsData.activeInvestments}
                  </p>
                </div>
                {user?.role === 'artist' ? (
                  <Target className="h-8 w-8 text-orange-400" />
                ) : (
                  <Briefcase className="h-8 w-8 text-orange-400" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Overview Card */}
          <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-5xl font-bold text-white mb-2">
                    {formatCurrency(analyticsData.totalRevenue)}
                  </h2>
                  <p className="text-slate-400 text-lg">Total Revenue</p>
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
                  <p className="text-slate-400">Engagement Rate</p>
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-sm font-semibold flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    +12.5%
                  </div>
                  <p className="text-slate-400 text-sm">vs last period</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Card */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {user?.role === 'artist' ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-8 w-8 text-cyan-400" />
                      <div>
                        <p className="text-white font-medium">Projects</p>
                        <p className="text-slate-400 text-sm">Active campaigns</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{analyticsData.totalProjects}</p>
                      <p className="text-green-400 text-sm">+2 this month</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-green-400" />
                      <div>
                        <p className="text-white font-medium">Funds Raised</p>
                        <p className="text-slate-400 text-sm">Total funding</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{formatCurrency(analyticsData.totalFundsRaised)}</p>
                      <p className="text-green-400 text-sm">+15.3%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">Monthly ROI</p>
                        <p className="text-slate-400 text-sm">Expected return</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{analyticsData.monthlyROI.toFixed(1)}%</p>
                      <p className="text-green-400 text-sm">+1.2%</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-8 w-8 text-cyan-400" />
                      <div>
                        <p className="text-white font-medium">Investments</p>
                        <p className="text-slate-400 text-sm">Portfolio size</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{analyticsData.totalInvestments}</p>
                      <p className="text-green-400 text-sm">+3 this month</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-green-400" />
                      <div>
                        <p className="text-white font-medium">Total Invested</p>
                        <p className="text-slate-400 text-sm">Portfolio value</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{formatCurrency(analyticsData.totalInvestedAmount)}</p>
                      <p className="text-green-400 text-sm">+8.7%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">Avg Return</p>
                        <p className="text-slate-400 text-sm">Portfolio performance</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{analyticsData.averageReturn.toFixed(1)}%</p>
                      <p className="text-green-400 text-sm">+0.8%</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Content Type Analysis */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-xl">Content Performance</CardTitle>
            <CardDescription className="text-slate-400">
              Breakdown by content type
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Content Type Breakdown */}
            <div className="space-y-4">
              {getContentTypeData().map((content, index) => {
                const IconComponent = content.icon;
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${content.color}`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white font-medium">{content.type}</span>
                      </div>
                      <span className="text-white font-semibold">{content.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={content.percentage} 
                        className="h-3 bg-slate-700"
                      />
                      <div className="absolute inset-0 flex items-center">
                        <div 
                          className={`h-full ${content.color} rounded-full`}
                          style={{ width: `${content.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-400">
                      {formatNumber(content.count)} items
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
                Project Status Breakdown
              </CardTitle>
              <CardDescription className="text-slate-400">
                Distribution of your projects by status
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
                      <div className="text-sm text-slate-400">Active</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <div>
                      <div className="text-white font-medium">Active Projects</div>
                      <div className="text-slate-400 text-sm">{analyticsData.projectStatusBreakdown.active.count} projects</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                    <div>
                      <div className="text-white font-medium">Draft Projects</div>
                      <div className="text-slate-400 text-sm">{analyticsData.projectStatusBreakdown.draft.count} projects</div>
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
                Investment Status Breakdown
              </CardTitle>
              <CardDescription className="text-slate-400">
                Distribution of your investments by status
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
                      <div className="text-sm text-slate-400">Active</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <div>
                      <div className="text-white font-medium">Active Investments</div>
                      <div className="text-slate-400 text-sm">{analyticsData.investmentStatusBreakdown.active.count} investments</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <div>
                      <div className="text-white font-medium">Completed</div>
                      <div className="text-slate-400 text-sm">{analyticsData.investmentStatusBreakdown.completed.count} investments</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <div>
                      <div className="text-white font-medium">Cancelled</div>
                      <div className="text-slate-400 text-sm">{analyticsData.investmentStatusBreakdown.cancelled.count} investments</div>
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
                Revenue Breakdown
              </CardTitle>
              <CardDescription className="text-slate-400">
                Revenue sources distribution
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
                Engagement Metrics
              </CardTitle>
              <CardDescription className="text-slate-400">
                Fan interaction and reach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.likes)}</p>
                  <p className="text-slate-400 text-sm">Total Likes</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.followers)}</p>
                  <p className="text-slate-400 text-sm">Followers</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{analyticsData.totalEngagement.toFixed(1)}%</p>
                  <p className="text-slate-400 text-sm">Engagement Rate</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{formatCurrency(analyticsData.totalRevenue)}</p>
                  <p className="text-slate-400 text-sm">Total Revenue</p>
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
