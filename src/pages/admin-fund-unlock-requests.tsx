import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetFundUnlockRequestsQuery } from "@/store/features/api/adminApi";
import { 
  ArrowLeft, 
  Unlock, 
  User, 
  Calendar, 
  DollarSign,
  Eye,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function AdminFundUnlockRequests() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const limit = 10;

  const { data: fundRequests, isLoading, error } = useGetFundUnlockRequestsQuery({
    page: currentPage,
    limit: limit,
    status: statusFilter || undefined,
  });

  const handleViewRequest = (requestId: string) => {
    navigate(`/admin/fund-unlock-request/${requestId}`);
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
        return 'bg-yellow-500/20 text-yellow-300';
      case 'approved':
        return 'bg-green-500/20 text-green-300';
      case 'rejected':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pb-32">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading fund unlock requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pb-32">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Requests</h2>
          <p className="text-slate-400 mb-6">Failed to load fund unlock requests.</p>
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          onClick={() => navigate('/admin/dashboard')}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-white mb-2">Fund Unlock Requests</h1>
        <p className="text-slate-400">Manage artist fund unlock requests</p>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <label className="text-slate-300 text-sm">Filter by status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Requests</CardTitle>
            <Unlock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {fundRequests?.data?.pagination?.totalRequests || 0}
            </div>
            <p className="text-xs text-slate-400">
              All time requests
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {fundRequests?.data?.requests?.filter((req: any) => req.status === 'pending').length || 0}
            </div>
            <p className="text-xs text-slate-400">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Current Page</CardTitle>
            <Calendar className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {currentPage}
            </div>
            <p className="text-xs text-slate-400">
              of {fundRequests?.data?.pagination?.totalPages || 1} pages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fund Unlock Requests List */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Fund Unlock Requests</CardTitle>
          <CardDescription className="text-slate-400">
            Review and manage artist fund unlock requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!fundRequests?.data?.requests?.length ? (
            <div className="text-center py-8">
              <div className="text-slate-400">No fund unlock requests found</div>
            </div>
          ) : (
            <div className="space-y-4">
              {fundRequests.data.requests.map((request: any) => (
                <div
                  key={request._id}
                  className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:bg-slate-700/40 transition-colors"
                >
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(request.status)}
                  </div>

                  {/* Request Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-white font-medium text-lg">
                            {request.projectId?.title || 'Unknown Project'}
                          </h3>
                          <Badge className={getStatusBadge(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                        
                        {/* Artist Information */}
                        <div className="flex items-center space-x-3 mb-2">
                          {request.artistId?.profilePicture ? (
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${request.artistId.profilePicture}`}
                              alt={request.artistId.username}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center">
                              <User className="w-3 h-3 text-slate-400" />
                            </div>
                          )}
                          <span className="text-slate-300 text-sm">
                            by {request.artistId?.username || 'Unknown Artist'}
                          </span>
                        </div>

                        {/* Request Stats */}
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>Project Goal: ${request.projectId?.fundingGoal?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Requested: {new Date(request.requestedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0 ml-4">
                        <Button
                          onClick={() => handleViewRequest(request._id)}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {fundRequests?.data?.pagination && fundRequests.data.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300"
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-slate-300">
                Page {currentPage} of {fundRequests.data.pagination.totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, fundRequests.data.pagination.totalPages))}
                disabled={currentPage === fundRequests.data.pagination.totalPages}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
