import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetFundRequestDetailsQuery, useApproveRejectFundRequestMutation } from "@/store/features/api/adminApi";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Unlock, 
  User, 
  DollarSign,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  List
} from "lucide-react";
import { useState } from "react";

export default function AdminFundRequestDetails() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adminResponse, setAdminResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: requestData, isLoading, error } = useGetFundRequestDetailsQuery(requestId!);
  const [approveRejectFundRequest] = useApproveRejectFundRequestMutation();

  const handleApproveReject = async (action: 'approve' | 'reject') => {
    if (!requestId) return;

    setIsProcessing(true);
    try {
      const result = await approveRejectFundRequest({
        requestId,
        data: {
          action,
          adminResponse: adminResponse || undefined,
          ...(request.projectMilestoneId && { milestoneId: request.projectMilestoneId }),
        }
      }).unwrap();

      toast({
        title: `Request ${action}d`,
        description: result.message,
      });

      // Navigate back to the list
      navigate('/admin/fund-unlock-requests');
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error?.data?.message || `Failed to ${action} request`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pb-32">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error || !requestData?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pb-32">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Request Not Found</h2>
          <p className="text-slate-400 mb-6">The fund unlock request you're looking for doesn't exist.</p>
          <Button
            onClick={() => navigate('/admin/fund-unlock-requests')}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Requests
          </Button>
        </div>
      </div>
    );
  }

  const { request, projectFundingStats } = requestData.data;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'approved':
        return 'bg-green-500/20 text-green-300';
      case 'rejected':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          onClick={() => navigate('/admin/fund-unlock-requests')}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Fund Unlock Requests
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Fund Request Details</h1>
            <p className="text-slate-400">Review and manage fund unlock request</p>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusIcon(request.status)}
            <Badge className={getStatusBadge(request.status)}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Information */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Project Title</p>
                  <p className="text-white font-medium">{request.projectId?.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Funding Goal</p>
                  <p className="text-white font-medium">${request.projectId?.fundingGoal?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Project Status</p>
                  <Badge className="bg-blue-500/20 text-blue-300">
                    {request.projectId?.status || 'N/A'}
                  </Badge>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Expected ROI</p>
                  <p className="text-white font-medium">{request.projectId?.expectedROIPercentage || 'N/A'}%</p>
                </div>
              </div>
              
              {request.projectId?.description && (
                <div>
                  <p className="text-slate-400 text-sm mb-2">Project Description</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{request.projectId.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Artist Information */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Artist Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                {request.artistId?.profilePicture ? (
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${request.artistId.profilePicture}`}
                    alt={request.artistId.username}
                    className="w-16 h-16 rounded-full object-cover border border-slate-600"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center border border-slate-500">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">{request.artistId?.username || 'Unknown Artist'}</h3>
                  <p className="text-slate-400">{request.artistId?.email || 'N/A'}</p>
                  {request.artistId?.country && (
                    <p className="text-slate-500 text-sm">{request.artistId.country}</p>
                  )}
                  {request.artistId?.artistBio && (
                    <p className="text-slate-300 text-sm mt-2 leading-relaxed">{request.artistId.artistBio}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Unlock className="w-5 h-5 mr-2" />
                Request Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Request ID</p>
                  <p className="text-white font-medium font-mono text-sm">{request._id}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Requested At</p>
                  <p className="text-white font-medium">{new Date(request.requestedAt).toLocaleString()}</p>
                </div>
                {request.respondedAt && (
                  <div>
                    <p className="text-slate-400 text-sm">Responded At</p>
                    <p className="text-white font-medium">{new Date(request.respondedAt).toLocaleString()}</p>
                  </div>
                )}
                {request.adminId && (
                  <div>
                    <p className="text-slate-400 text-sm">Processed By</p>
                    <p className="text-white font-medium">{request.adminId.username || 'Admin'}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Milestone Details */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Milestone Details
              </CardTitle>
              <CardDescription className="text-slate-400">
                Project milestone information for this fund unlock request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.projectId?.milestones && request.projectId.milestones.length > 0 ? (
                <div className="space-y-4">
                  {/* All Project Milestones */}
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <List className="w-4 h-4 mr-2" />
                      All Project Milestones
                    </h4>
                    <div className="space-y-3">
                      {[...request.projectId.milestones]
                        .sort((a: any, b: any) => a.order - b.order)
                        .map((milestone: any, index: number) => {
                          const isRequestedMilestone = request.projectMilestoneId && 
                            request.projectMilestoneId.toString() === milestone._id?.toString();
                          
                          return (
                            <div
                              key={milestone._id || index}
                              className={`p-4 rounded-lg border ${
                                isRequestedMilestone
                                  ? 'bg-purple-500/10 border-purple-500/30'
                                  : 'bg-slate-700/30 border-slate-600'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                      isRequestedMilestone
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-slate-600 text-slate-300'
                                    }`}>
                                      {milestone.order}
                                    </div>
                                    <h5 className={`font-medium ${
                                      isRequestedMilestone ? 'text-purple-300' : 'text-white'
                                    }`}>
                                      {milestone.name}
                                    </h5>
                                    {isRequestedMilestone && (
                                      <Badge className="bg-purple-500/20 text-purple-300">
                                        Requested
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <p className="text-slate-300 text-sm mb-2">
                                    {milestone.description}
                                  </p>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                                      <div className="flex items-center space-x-1">
                                        <DollarSign className="w-3 h-3" />
                                        <span>Amount: ${milestone.amount.toLocaleString()}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Target className="w-3 h-3" />
                                        <span>Order: {milestone.order}</span>
                                      </div>
                                    </div>
                                    
                                    <Badge className={
                                      milestone.status === 'approved' 
                                        ? 'bg-green-500/20 text-green-300'
                                        : milestone.status === 'pending'
                                        ? 'bg-yellow-500/20 text-yellow-300'
                                        : 'bg-gray-500/20 text-gray-300'
                                    }>
                                      {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Requested Milestone Summary */}
                  {request.projectMilestoneId && (
                    <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <h4 className="text-purple-300 font-medium mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        This Request is for:
                      </h4>
                      {(() => {
                        const requestedMilestone = request.projectId.milestones.find(
                          (m: any) => m._id?.toString() === request.projectMilestoneId?.toString()
                        );
                        return requestedMilestone ? (
                          <div>
                            <p className="text-white font-medium text-lg">{requestedMilestone.name}</p>
                            <p className="text-slate-300 text-sm mt-1">{requestedMilestone.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              <span className="text-slate-400">
                                Amount: <span className="text-white font-medium">${requestedMilestone.amount.toLocaleString()}</span>
                              </span>
                              <span className="text-slate-400">
                                Order: <span className="text-white font-medium">{requestedMilestone.order}</span>
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-400">Milestone details not found</p>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Target className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400">No milestones found for this project</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Funding Statistics */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Funding Statistics</CardTitle>
              <CardDescription className="text-slate-400">
                Current project funding status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Total Raised</span>
                <span className="text-white font-bold">${projectFundingStats.totalRaised.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Funding Goal</span>
                <span className="text-white font-bold">${projectFundingStats.fundingGoal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Progress</span>
                <span className="text-white font-bold">{projectFundingStats.fundingProgress.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Total Investors</span>
                <span className="text-white font-bold">{projectFundingStats.totalInvestors}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(projectFundingStats.fundingProgress, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {request.status === 'pending' && (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
                <CardDescription className="text-slate-400">
                  Approve or reject this request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Admin Response (Optional)</label>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Add a response message..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleApproveReject('approve')}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleApproveReject('reject')}
                    disabled={isProcessing}
                    variant="destructive"
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Request Status */}
          {request.status !== 'pending' && (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Request Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                  {getStatusIcon(request.status)}
                  <div>
                    <p className="text-white font-medium">
                      Request {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {request.respondedAt ? 
                        `Processed on ${new Date(request.respondedAt).toLocaleDateString()}` : 
                        'No response date available'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
