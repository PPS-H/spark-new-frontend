import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useGetDraftProjectsQuery } from "@/store/features/api/adminApi";
import { 
  FileText, 
  Eye, 
  Music, 
  User, 
  Clock, 
  Target,
  DollarSign
} from "lucide-react";

export default function AdminDraftProjects() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data: draftProjects, isLoading, error } = useGetDraftProjectsQuery({
    page: currentPage,
    limit: limit,
  });

  const handleViewProject = (projectId: string) => {
    navigate(`/admin/project/${projectId}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Draft Projects</h1>
        <p className="text-slate-400">Projects awaiting admin approval</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Draft Projects</CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {draftProjects?.pagination?.totalPages ? 
                draftProjects.pagination.totalPages * limit : 0}
            </div>
            <p className="text-xs text-slate-400">
              Projects awaiting review
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Current Page</CardTitle>
            <Clock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {currentPage}
            </div>
            <p className="text-xs text-slate-400">
              of {draftProjects?.pagination?.totalPages || 1} pages
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Items Per Page</CardTitle>
            <Target className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {limit}
            </div>
            <p className="text-xs text-slate-400">
              Projects per page
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Draft Projects List */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Draft Projects</CardTitle>
          <CardDescription className="text-slate-400">
            Review and approve projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-slate-400">Loading projects...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-400">Error loading projects</div>
            </div>
          ) : draftProjects?.data?.projects?.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-400">No draft projects found</div>
            </div>
          ) : (
            <div className="space-y-4">
              {draftProjects?.data?.projects?.map((project: any) => (
                <div
                  key={project._id}
                  className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:bg-slate-700/40 transition-colors"
                >
                  {/* Project Image */}
                  <div className="flex-shrink-0">
                    {project.image ? (
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.image}`}
                        alt={project.title}
                        className="w-16 h-16 rounded-lg object-cover border border-slate-600"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-600 flex items-center justify-center border border-slate-500">
                        <Music className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-lg mb-1">{project.title}</h3>
                        <p className="text-slate-400 text-sm mb-2">
                          Song: {project.songTitle || 'N/A'}
                        </p>
                        
                        {/* Artist Information */}
                        <div className="flex items-center space-x-3 mb-2">
                          {project.userId?.profilePicture ? (
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.userId.profilePicture}`}
                              alt={project.userId.username}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center">
                              <User className="w-3 h-3 text-slate-400" />
                            </div>
                          )}
                          <span className="text-slate-300 text-sm">
                            by {project.userId?.username || 'Unknown Artist'}
                          </span>
                          {project.userId?.country && (
                            <span className="text-slate-500 text-xs">
                              • {project.userId.country}
                            </span>
                          )}
                        </div>

                        {/* Project Stats */}
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>Goal: ${project.fundingGoal?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Duration: {project.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="w-3 h-3" />
                            <span>ROI: {project.expectedROIPercentage}%</span>
                          </div>
                        </div>

                        {/* Project Description Preview */}
                        {project.description && (
                          <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                            {project.description.length > 100 
                              ? `${project.description.substring(0, 100)}...` 
                              : project.description
                            }
                          </p>
                        )}

                        {/* Created Date */}
                        <p className="text-slate-600 text-xs mt-2">
                          Created: {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0 ml-4">
                        <Button
                          onClick={() => handleViewProject(project._id)}
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
          {draftProjects?.pagination && draftProjects.pagination.totalPages > 1 && (
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
                Page {currentPage} of {draftProjects.pagination.totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, draftProjects.pagination.totalPages))}
                disabled={currentPage === draftProjects.pagination.totalPages}
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
