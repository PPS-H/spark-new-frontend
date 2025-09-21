import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetProjectDetailsQuery } from "@/store/features/api/labelApi";
import { useSubmitFundUnlockRequestMutation, useGetFundUnlockRequestStatusQuery } from "@/store/features/api/projectApi";
import { useAuth } from "@/hooks/useAuthRTK";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Music, 
  Calendar, 
  Users, 
  Target,
  XCircle,
  Unlock,
  Clock
} from "lucide-react";

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  console.log("projectId::::",projectId)
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: projectData, isLoading, error } = useGetProjectDetailsQuery({ projectId: projectId! });
  
  // Fund unlock request hooks
  const { data: fundRequestStatus, refetch: refetchFundStatus } = useGetFundUnlockRequestStatusQuery(projectId!, {
    skip: !projectId || !user || user.role !== 'artist'
  });
  
  const [submitFundUnlockRequest, { isLoading: isSubmittingRequest }] = useSubmitFundUnlockRequestMutation();

  // Handle fund unlock request
  const handleFundUnlockRequest = async () => {
    if (!projectId) return;

    try {
      const result = await submitFundUnlockRequest({ projectId }).unwrap();
      
      toast({
        title: "Fund Unlock Request Submitted",
        description: `Your request for milestone "${result.data.milestoneName}" has been submitted successfully.`,
      });
      
      // Refetch the status to update the UI
      refetchFundStatus();
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error?.data?.message || "Failed to submit fund unlock request",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pb-32">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !projectData?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pb-32">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-slate-400 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { project, artistPerformance, fundingProgress, roiExplanation } = projectData.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 pb-32">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-white mb-2">{project.title}</h1>
          <p className="text-slate-400 text-lg">{project.songTitle} by {project.artistName}</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Image */}
            {project.image && (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-0">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.image}`}
                    alt={project.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Project Details */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Project Details</CardTitle>
                <CardDescription className="text-slate-400">
                  Comprehensive information about this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Music className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Song Title</p>
                      <p className="text-white font-medium">{project.songTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Artist</p>
                      <p className="text-white font-medium">{project.artistName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Funding Deadline</p>
                      <p className="text-white font-medium">
                        {project.fundingDeadline ? new Date(project.fundingDeadline).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Expected ROI</p>
                      <p className="text-white font-medium">{artistPerformance.expectedROI}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Artist Information */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Artist Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                    <Music className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{project.artist.username}</h3>
                    <p className="text-slate-400">{project.artist.email}</p>
                  </div>
                </div>
                {project.artist.artistBio && (
                  <div>
                    <p className="text-slate-300 text-sm leading-relaxed">{project.artist.artistBio}</p>
                  </div>
                )}
                {project.artist.aboutTxt && (
                  <div>
                    <p className="text-slate-300 text-sm leading-relaxed">{project.artist.aboutTxt}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Progress */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Funding Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    ${fundingProgress.raised.toLocaleString()}
                  </div>
                  <p className="text-slate-400 text-sm">of ${fundingProgress.goal.toLocaleString()} goal</p>
                </div>
                
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(fundingProgress.funded, 100)}%` }}
                  ></div>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">{fundingProgress.funded}%</p>
                  <p className="text-slate-400 text-sm">funded</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-white font-semibold">{fundingProgress.totalInvestors}</p>
                    <p className="text-slate-400 text-xs">Investors</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{artistPerformance.riskLevel}</p>
                    <p className="text-slate-400 text-xs">Risk Level</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Limits */}
            {/* <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Investment Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Minimum</span>
                  <span className="text-white font-medium">${investmentLimits.min}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Maximum</span>
                  <span className="text-white font-medium">${investmentLimits.max.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Remaining</span>
                  <span className="text-white font-medium">${investmentLimits.remaining.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card> */}

            {/* ROI Explanation */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Revenue Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <p className="text-slate-300 text-sm font-medium">{roiExplanation.model}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-xs">{roiExplanation.investorShare}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-xs">{roiExplanation.payoutFrequency}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-xs">{roiExplanation.riskNote}</p>
                </div>
              </CardContent>
            </Card>

            {/* Artist Performance */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Artist Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly Listeners</span>
                  <span className="text-white font-medium">{artistPerformance.monthlyListeners?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected ROI</span>
                  <span className="text-white font-medium">{artistPerformance.expectedROI}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Level</span>
                  <Badge 
                    className={`${
                      artistPerformance.riskLevel === 'Low' ? 'bg-green-500/20 text-green-300' :
                      artistPerformance.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      artistPerformance.riskLevel === 'High' ? 'bg-red-500/20 text-red-300' :
                      'bg-orange-500/20 text-orange-300'
                    }`}
                  >
                    {artistPerformance.riskLevel}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fund Unlock Section - Only for Artists */}
            {user && user.role === 'artist' && project.artist._id === user._id && (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Unlock className="w-5 h-5 mr-2" />
                    Fund Unlock
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Request to unlock funds for your project milestones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fundRequestStatus?.data?.hasPendingRequest ? (
                    <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <div className="flex-1">
                        <p className="text-yellow-300 font-medium">Request Pending</p>
                        <p className="text-yellow-400 text-sm">
                          Your fund unlock request is being reviewed by admin
                        </p>
                        <p className="text-yellow-500 text-xs mt-1">
                          Requested: {new Date(fundRequestStatus.data.pendingRequest?.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : fundRequestStatus?.data?.fundingStats?.canRequestUnlock ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-green-300 font-medium">Ready to Unlock</p>
                          <p className="text-green-400 text-sm">
                            Your project has reached {fundRequestStatus.data.fundingStats.fundingPercentage.toFixed(1)}% funding
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        onClick={handleFundUnlockRequest}
                        disabled={isSubmittingRequest}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isSubmittingRequest ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Submitting Request...
                          </>
                        ) : (
                          <>
                            <Unlock className="w-4 h-4 mr-2" />
                            Unlock My Funds
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-red-300 font-medium">Not Available</p>
                        <p className="text-red-400 text-sm">
                          Project needs to reach 50% funding goal to unlock funds
                        </p>
                        {fundRequestStatus?.data?.fundingStats && (
                          <p className="text-red-500 text-xs mt-1">
                            Current: {fundRequestStatus.data.fundingStats.fundingPercentage.toFixed(1)}% of goal
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
