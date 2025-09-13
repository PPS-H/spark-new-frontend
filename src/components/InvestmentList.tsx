import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetInvestedProjectsQuery } from "@/store/features/api/labelApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, DollarSign, TrendingUp, User, Music, Target, Clock } from "lucide-react";

export default function InvestmentList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Get invested projects from API
  const { data: investedProjectsData, isLoading, error } = useGetInvestedProjectsQuery({
    page: currentPage,
    limit: limit
  });

  // Helper function to get dummy profile image
  const getDummyProfileImage = (username: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=100`;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'border-green-500 text-green-400 bg-green-500/10';
      case 'pending':
        return 'border-yellow-500 text-yellow-400 bg-yellow-500/10';
      case 'completed':
        return 'border-blue-500 text-blue-400 bg-blue-500/10';
      default:
        return 'border-gray-500 text-gray-400 bg-gray-500/10';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Loading your investments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-400 text-lg">Failed to load investments. Please try again.</div>
      </div>
    );
  }

  if (!investedProjectsData?.data?.projects || investedProjectsData.data.projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Investments Yet</h3>
          <p className="text-gray-400 mb-6 max-w-md">
            You haven't made any investments yet. Start investing now to see your projects here.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2"
        >
          Start Investing
        </Button>
      </div>
    );
  }

  const projects = investedProjectsData.data.projects;
  const pagination = investedProjectsData.pagination;

  // Debug logging for project images
  console.log('🎯 InvestmentList projects:', projects.map(p => ({ 
    title: p.title, 
    image: p.image 
  })));

  return (
    <div className="space-y-6">
      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {projects.map((project) => (
          <Card key={project._id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
            <CardContent className="p-6">
              {/* Project Image */}
              {project.image && (
                <div className="mb-4">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.image}`}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* Header with Artist Info and Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <img 
                      src={getDummyProfileImage(project.userId.username)} 
                      alt={project.userId.username}
                      className="w-full h-full object-cover"
                    />
                    <AvatarFallback className="text-sm font-semibold">
                      {project.userId.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{project.title}</h3>
                    <p className="text-slate-400 text-sm">
                      by {project.artistName} • {project.userId.favoriteGenre}
                    </p>
                    <p className="text-slate-500 text-xs flex items-center mt-1">
                      <User className="w-3 h-3 mr-1" />
                      {project.userId.username} • {project.userId.country}
                    </p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(project.status)} px-3 py-1 capitalize`}>
                  {project.status}
                </Badge>
              </div>

              {/* Project Details */}
              <div className="mb-4">
                <p className="text-slate-300 text-sm mb-3 line-clamp-2 capitalize">{project.description}</p>
                <div className="flex items-center space-x-4 text-slate-400 text-sm">
                  <div className="flex items-center">
                    <Music className="w-4 h-4 mr-1" />
                    {project.songTitle}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {project.duration} days
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(project.expectedReleaseDate)}
                  </div>
                </div>
              </div>

              {/* Investment Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <DollarSign className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-xs text-slate-400">Funding Goal</span>
                  </div>
                  <p className="text-white font-semibold">${project.fundingGoal.toLocaleString()}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-xs text-slate-400">Expected ROI</span>
                  </div>
                  <p className="text-white font-semibold">{project.expectedROIPercentage}%</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Target className="w-4 h-4 text-purple-400 mr-1" />
                    <span className="text-xs text-slate-400">Release Type</span>
                  </div>
                  <p className="text-white font-semibold capitalize">{project.releaseType}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Calendar className="w-4 h-4 text-orange-400 mr-1" />
                    <span className="text-xs text-slate-400">Deadline</span>
                  </div>
                  <p className="text-white font-semibold text-xs">{formatDate(project.fundingDeadline)}</p>
                </div>
              </div>

              {/* Verification Status */}
              {project.isVerified && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="flex items-center text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Verified Project
                  </div>
                  <div className="text-slate-500 text-xs">
                    Verified on {formatDate(project.verifiedAt)}
                  </div>
                </div>
              )}

              {/* View Details Button */}
              <div className="pt-4">
                <Button
                  onClick={() => navigate(`/invest/${project._id}`)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 pt-6">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Previous
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-sm">
              Page {currentPage} of {pagination.totalPages}
            </span>
          </div>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
