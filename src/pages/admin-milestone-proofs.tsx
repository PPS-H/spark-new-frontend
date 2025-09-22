import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetMilestoneProofsQuery } from "@/store/features/api/adminApi";
import { 
  ArrowLeft, 
  CheckSquare, 
  User, 
  Calendar, 
  DollarSign,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  FileText
} from "lucide-react";

export default function AdminMilestoneProofs() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const limit = 10;

  const { data: milestoneProofs, isLoading, error } = useGetMilestoneProofsQuery({
    page: currentPage,
    limit: limit,
    status: statusFilter || undefined,
  });

  const handleViewProof = (proofId: string) => {
    navigate(`/admin/milestone-proof/${proofId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            Pending
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading milestone proofs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Proofs</h2>
          <p className="text-slate-400 mb-6">There was an error loading the milestone proofs.</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const proofs = milestoneProofs?.data?.milestoneProofs || [];
  const pagination = milestoneProofs?.data?.pagination;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <CheckSquare className="w-8 h-8 mr-3 text-purple-400" />
                Milestone Proofs
              </h1>
              <p className="text-slate-400">
                Review and manage artist milestone proofs
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-slate-300 text-sm font-medium">Filter by Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestone Proofs List */}
        <div className="space-y-4">
          {proofs.length === 0 ? (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No Milestone Proofs Found</h3>
                <p className="text-slate-500">
                  {statusFilter ? `No proofs found with status "${statusFilter}"` : "No milestone proofs have been submitted yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            proofs.map((proof: any) => (
              <Card key={proof.proofId} className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getStatusIcon(proof.status)}
                        <h3 className="text-lg font-semibold text-white">
                          Milestone Proof
                        </h3>
                        {getStatusBadge(proof.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-slate-400 text-sm">Artist</p>
                            <p className="text-white font-medium">
                              {proof.artistId?.username || 'Unknown Artist'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-slate-400 text-sm">Project</p>
                            <p className="text-white font-medium">
                              {proof.projectId?.title || 'Unknown Project'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-slate-400 text-sm">Submitted</p>
                            <p className="text-white font-medium">
                              {new Date(proof.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-slate-400 text-sm mb-1">Description</p>
                        <p className="text-slate-300 text-sm line-clamp-2">
                          {proof.description || 'No description provided'}
                        </p>
                      </div>

                      {proof.adminResponse && (
                        <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                          <p className="text-slate-400 text-sm mb-1">Admin Response</p>
                          <p className="text-slate-300 text-sm">
                            {proof.adminResponse}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        onClick={() => handleViewProof(proof.proofId)}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 mt-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-slate-400 text-sm">
                  Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.totalCount)} of {pagination.totalCount} proofs
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className={
                          currentPage === page
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "border-slate-600 text-slate-300 hover:bg-slate-700"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
