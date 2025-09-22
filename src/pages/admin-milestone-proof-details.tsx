import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useGetMilestoneProofDetailsQuery, useApproveRejectMilestoneProofMutation } from "@/store/features/api/adminApi";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  CheckSquare, 
  User, 
  Calendar, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Eye,
  AlertCircle
} from "lucide-react";

export default function AdminMilestoneProofDetails() {
  const { proofId } = useParams<{ proofId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adminResponse, setAdminResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: proofData, isLoading, error } = useGetMilestoneProofDetailsQuery(proofId!);
  const [approveRejectMilestoneProof] = useApproveRejectMilestoneProofMutation();

  const handleApproveReject = async (action: 'approve' | 'reject') => {
    if (!proofId) return;

    setIsProcessing(true);
    try {
      const result = await approveRejectMilestoneProof({
        proofId,
        data: {
          action,
          adminResponse: adminResponse || undefined,
        }
      }).unwrap();

      toast({
        title: `Proof ${action}d`,
        description: result.message,
      });

      // Navigate back to the list
      navigate('/admin/milestone-proofs');
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error?.data?.message || `Failed to ${action} proof`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadProof = () => {
    if (proofData?.data?.proof?.proof) {
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${proofData.data.proof.proof}`;
      link.download = `milestone-proof-${proofId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading proof details...</p>
        </div>
      </div>
    );
  }

  if (error || !proofData?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Proof Not Found</h2>
          <p className="text-slate-400 mb-6">The milestone proof you're looking for doesn't exist or has been removed.</p>
          <Button
            onClick={() => navigate('/admin/milestone-proofs')}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Proofs
          </Button>
        </div>
      </div>
    );
  }

  const { proof } = proofData.data;

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
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            Pending Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/admin/milestone-proofs')}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Proofs
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <CheckSquare className="w-8 h-8 mr-3 text-purple-400" />
                Milestone Proof Details
              </h1>
              <p className="text-slate-400">
                Review and manage this milestone proof submission
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {getStatusIcon(proof.status)}
              {getStatusBadge(proof.status)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Proof Information */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Proof Information
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Details about the milestone proof submission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-slate-300 font-medium mb-2">Description</h4>
                  <p className="text-slate-200 bg-slate-700/50 p-4 rounded-lg">
                    {proof.description || 'No description provided'}
                  </p>
                </div>

                <div>
                  <h4 className="text-slate-300 font-medium mb-2">Proof File</h4>
                  <div className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg">
                    <FileText className="w-8 h-8 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-slate-200 font-medium">Milestone Proof Document</p>
                      <p className="text-slate-400 text-sm">
                        Submitted on {new Date(proof.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={handleDownloadProof}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {proof.adminResponse && (
                  <div>
                    <h4 className="text-slate-300 font-medium mb-2">Admin Response</h4>
                    <p className="text-slate-200 bg-slate-700/50 p-4 rounded-lg">
                      {proof.adminResponse}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Milestone Details */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Milestone Details
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Information about the milestone this proof is for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-slate-300 font-medium mb-2">Milestone Name</h4>
                    <p className="text-slate-200">{proof.milestone?.name || 'Unknown Milestone'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-slate-300 font-medium mb-2">Amount</h4>
                    <p className="text-slate-200 font-semibold">
                      ${proof.milestone?.amount?.toLocaleString() || '0'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-slate-300 font-medium mb-2">Status</h4>
                    <Badge 
                      className={`${
                        proof.milestone?.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                        proof.milestone?.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {proof.milestone?.status || 'Unknown'}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="text-slate-300 font-medium mb-2">Order</h4>
                    <p className="text-slate-200">#{proof.milestone?.order || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-slate-300 font-medium mb-2">Description</h4>
                  <p className="text-slate-200 bg-slate-700/50 p-4 rounded-lg">
                    {proof.milestone?.description || 'No description available'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Artist Information */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Artist Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                    {proof.artistId?.profilePicture ? (
                      <img
                        src={proof.artistId.profilePicture}
                        alt={proof.artistId.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{proof.artistId?.username || 'Unknown Artist'}</h4>
                    <p className="text-slate-400 text-sm">{proof.artistId?.email || 'No email'}</p>
                  </div>
                </div>

                {proof.artistId?.country && (
                  <div>
                    <h4 className="text-slate-300 font-medium mb-1">Country</h4>
                    <p className="text-slate-200">{proof.artistId.country}</p>
                  </div>
                )}

                {proof.artistId?.artistBio && (
                  <div>
                    <h4 className="text-slate-300 font-medium mb-1">Bio</h4>
                    <p className="text-slate-200 text-sm line-clamp-3">{proof.artistId.artistBio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Information */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-slate-300 font-medium mb-1">Project Title</h4>
                  <p className="text-slate-200">{proof.projectId?.title || 'Unknown Project'}</p>
                </div>

                <div>
                  <h4 className="text-slate-300 font-medium mb-1">Funding Goal</h4>
                  <p className="text-slate-200 font-semibold">
                    ${proof.projectId?.fundingGoal?.toLocaleString() || '0'}
                  </p>
                </div>

                <div>
                  <h4 className="text-slate-300 font-medium mb-1">Status</h4>
                  <Badge 
                    className={`${
                      proof.projectId?.status === 'active' ? 'bg-green-500/20 text-green-300' :
                      proof.projectId?.status === 'draft' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}
                  >
                    {proof.projectId?.status || 'Unknown'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Admin Actions */}
            {proof.status === 'pending' && (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Admin Actions
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Review and take action on this proof
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-slate-300 font-medium mb-2 block">
                      Admin Response (Optional)
                    </label>
                    <Textarea
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      placeholder="Add your response or feedback..."
                      className="bg-slate-700 border-slate-600 text-white"
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
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleApproveReject('reject')}
                      disabled={isProcessing}
                      variant="destructive"
                      className="flex-1"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
