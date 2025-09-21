import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useGetProjectDetailsQuery, useApproveRejectProjectMutation } from "@/store/features/api/adminApi";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  DollarSign, 
  Music, 
  Globe, 
  CheckCircle, 
  XCircle,
  Clock,
  FileText,
  Download,
  AlertCircle,
  Image,
  Target
} from "lucide-react";

export default function AdminProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: projectData, isLoading, error } = useGetProjectDetailsQuery(projectId!);
  const [approveRejectProject, { isLoading: isProcessing }] = useApproveRejectProjectMutation();

  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleApprove = async () => {
    if (!projectId) return;

    try {
      await approveRejectProject({
        projectId,
        data: { action: 'approve' }
      }).unwrap();

      toast({
        title: "Success",
        description: "Project approved successfully",
      });

      navigate('/admin/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to approve project",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!projectId) return;

    try {
      await approveRejectProject({
        projectId,
        data: { 
          action: 'reject',
          reason: rejectionReason || undefined
        }
      }).unwrap();

      toast({
        title: "Success",
        description: "Project rejected successfully",
      });

      navigate('/admin/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to reject project",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading project details...</div>
      </div>
    );
  }

  if (error || !projectData?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-red-400">Error loading project details</div>
      </div>
    );
  }

  const { project, fundingStats } = projectData.data;

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="mb-8">
        <Button
          onClick={() => navigate('/admin/draft-projects')}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Draft Projects
        </Button>
        <h1 className="text-3xl font-bold text-white">Project Details</h1>
        <p className="text-slate-400">Review project information and approve or reject</p>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Main Content Area */}
        <div className="flex-1 max-w-4xl">
          {/* Project Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-2xl">{project.title}</CardTitle>
                  <Badge 
                    className={
                      project.status === 'draft' ? 'bg-yellow-500/20 text-yellow-300' :
                      project.status === 'active' ? 'bg-green-500/20 text-green-300' :
                      'bg-red-500/20 text-red-300'
                    }
                  >
                    {project.status?.toUpperCase()}
                  </Badge>
                </div>
                <CardDescription className="text-slate-400">
                  by {project.userId?.username || 'Unknown Artist'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">{project.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">Goal: ${project.fundingGoal?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">Duration: {project.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Music className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">Song: {project.songTitle}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">Artist: {project.artistName}</span>
                  </div>
                </div>

                {project.expectedReleaseDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">
                      Expected Release: {new Date(project.expectedReleaseDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Artist Information */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Artist Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  {project.userId?.profilePicture && (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.userId.profilePicture}`}
                      alt="Artist"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-white font-medium">{project.userId?.username}</h3>
                    <p className="text-slate-400">{project.userId?.email}</p>
                    <p className="text-slate-500 text-sm">{project.userId?.country}</p>
                  </div>
                </div>

                {project.userId?.artistBio && (
                  <p className="text-slate-300">{project.userId.artistBio}</p>
                )}

                {project.userId?.socialMediaLinks && (
                  <div className="flex space-x-4">
                    {project.userId.socialMediaLinks.instagram && (
                      <a
                        href={project.userId.socialMediaLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {project.userId.socialMediaLinks.youtube && (
                      <a
                        href={project.userId.socialMediaLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {project.userId.socialMediaLinks.spotify && (
                      <a
                        href={project.userId.socialMediaLinks.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* DistroKid File Information */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  DistroKid File
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Distribution file for music platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.distrokidFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div className="flex-1">
                        <p className="text-green-300 font-medium">DistroKid File Available</p>
                        <p className="text-green-400 text-sm">File has been uploaded successfully</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-300 text-sm font-medium">File Name</p>
                          <p className="text-slate-400 text-xs">
                            {project.distrokidFile.split('/').pop() || 'distrokid-file'}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          const fileUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.distrokidFile}`;
                          window.open(fileUrl, '_blank');
                        }}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>

                    {/* Additional DistroKid Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {project.distroKidReleaseId && (
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">Release ID:</span>
                          <span className="text-slate-300 font-mono text-xs">
                            {project.distroKidReleaseId}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">Connected:</span>
                        <Badge 
                          className={project.distroKidConnected ? 
                            'bg-green-500/20 text-green-300' : 
                            'bg-red-500/20 text-red-300'
                          }
                        >
                          {project.distroKidConnected ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <div className="flex-1">
                        <p className="text-red-300 font-medium">DistroKid File Not Available</p>
                        <p className="text-red-400 text-sm">No distribution file has been uploaded for this project</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600">
                      <p className="text-slate-400 text-sm">
                        This project does not have a DistroKid distribution file. The artist may need to upload 
                        the required distribution file before the project can be approved for music platform distribution.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invoice File Information */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Invoice File
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Financial documentation for the project
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.invoiceFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div className="flex-1">
                        <p className="text-green-300 font-medium">Invoice File Available</p>
                        <p className="text-green-400 text-sm">Financial documentation has been uploaded successfully</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-300 text-sm font-medium">File Name</p>
                          <p className="text-slate-400 text-xs">
                            {project.invoiceFile.split('/').pop() || 'invoice-file'}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          const fileUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.invoiceFile}`;
                          window.open(fileUrl, '_blank');
                        }}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <div className="flex-1">
                        <p className="text-red-300 font-medium">Invoice File Not Available</p>
                        <p className="text-red-400 text-sm">No financial documentation has been uploaded for this project</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600">
                      <p className="text-slate-400 text-sm">
                        This project does not have an invoice file. The artist may need to upload 
                        the required financial documentation before the project can be approved.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Image */}
            {project.image && (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Image className="w-5 h-5 mr-2" />
                    Project Image
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Visual representation of the project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div className="flex-1">
                        <p className="text-green-300 font-medium">Project Image Available</p>
                        <p className="text-green-400 text-sm">Visual asset has been uploaded successfully</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.image}`}
                        alt="Project Image"
                        className="w-full h-64 object-cover rounded-lg border border-slate-600"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          onClick={() => {
                            const imageUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.image}`;
                            window.open(imageUrl, '_blank');
                          }}
                          variant="outline"
                          size="sm"
                          className="bg-black/50 border-white/20 text-white hover:bg-white/10"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          View Full Size
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Milestones */}
            {project.milestones && project.milestones.length > 0 && (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Project Milestones
                </CardTitle>
                  <CardDescription className="text-slate-400">
                    Breakdown of funding allocation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.milestones.map((milestone: any, index: number) => (
                    <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{milestone.name}</h4>
                        <Badge className="bg-purple-500/20 text-purple-300">
                          ${milestone.amount?.toLocaleString()}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-sm">{milestone.description}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                        <span>Order: {milestone.order}</span>
                        <span>{((milestone.amount / project.fundingGoal) * 100).toFixed(1)}% of total</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium">Total Milestone Amount:</span>
                      <span className="text-white font-bold">
                        ${project.milestones.reduce((sum: number, m: any) => sum + (m.amount || 0), 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-slate-300 font-medium">Funding Goal:</span>
                      <span className="text-white font-bold">${project.fundingGoal?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-600">
                      <span className="text-slate-300 font-medium">Status:</span>
                      <Badge 
                        className={
                          project.milestones.reduce((sum: number, m: any) => sum + (m.amount || 0), 0) === project.fundingGoal
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-red-500/20 text-red-300'
                        }
                      >
                        {project.milestones.reduce((sum: number, m: any) => sum + (m.amount || 0), 0) === project.fundingGoal
                          ? 'Balanced'
                          : 'Unbalanced'
                        }
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Metadata */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Project Metadata</CardTitle>
                <CardDescription className="text-slate-400">
                  Technical information and codes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-400 text-sm">ISRC Code</label>
                    <p className="text-slate-300 font-mono text-sm bg-slate-700/30 p-2 rounded">
                      {project.isrcCode || 'Not provided'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-slate-400 text-sm">UPC Code</label>
                    <p className="text-slate-300 font-mono text-sm bg-slate-700/30 p-2 rounded">
                      {project.upcCode || 'Not provided'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-slate-400 text-sm">Release Type</label>
                    <p className="text-slate-300 capitalize bg-slate-700/30 p-2 rounded">
                      {project.releaseType || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-slate-400 text-sm">Expected ROI</label>
                    <p className="text-slate-300 bg-slate-700/30 p-2 rounded">
                      {project.expectedROIPercentage ? `${project.expectedROIPercentage}%` : 'Not specified'}
                    </p>
                  </div>
                </div>

                {/* Platform Links */}
                {(project.spotifyTrackLink || project.youtubeMusicLink || project.deezerTrackLink) && (
                  <div className="space-y-3">
                    <label className="text-slate-400 text-sm">Platform Links</label>
                    <div className="space-y-2">
                      {project.spotifyTrackLink && (
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400 text-xs w-16">Spotify:</span>
                          <a
                            href={project.spotifyTrackLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-xs truncate"
                          >
                            {project.spotifyTrackLink}
                          </a>
                        </div>
                      )}
                      {project.youtubeMusicLink && (
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400 text-xs w-16">YouTube:</span>
                          <a
                            href={project.youtubeMusicLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-xs truncate"
                          >
                            {project.youtubeMusicLink}
                          </a>
                        </div>
                      )}
                      {project.deezerTrackLink && (
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400 text-xs w-16">Deezer:</span>
                          <a
                            href={project.deezerTrackLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-xs truncate"
                          >
                            {project.deezerTrackLink}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Fixed Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-6 space-y-6">
            {/* Project Files Summary */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Project Files</CardTitle>
                <CardDescription className="text-slate-400">
                  Uploaded documents and assets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">DistroKid File</span>
                  <Badge 
                    className={project.distrokidFile ? 
                      'bg-green-500/20 text-green-300' : 
                      'bg-red-500/20 text-red-300'
                    }
                  >
                    {project.distrokidFile ? 'Available' : 'Missing'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">Invoice File</span>
                  <Badge 
                    className={project.invoiceFile ? 
                      'bg-green-500/20 text-green-300' : 
                      'bg-red-500/20 text-red-300'
                    }
                  >
                    {project.invoiceFile ? 'Available' : 'Missing'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">Project Image</span>
                  <Badge 
                    className={project.image ? 
                      'bg-green-500/20 text-green-300' : 
                      'bg-yellow-500/20 text-yellow-300'
                    }
                  >
                    {project.image ? 'Available' : 'Optional'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">Milestones</span>
                  <Badge 
                    className={project.milestones && project.milestones.length > 0 ? 
                      'bg-green-500/20 text-green-300' : 
                      'bg-red-500/20 text-red-300'
                    }
                  >
                    {project.milestones && project.milestones.length > 0 ? 
                      `${project.milestones.length} defined` : 'Missing'
                    }
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Funding Stats */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Funding Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Total Raised</span>
                  <span className="text-white font-bold">${fundingStats.totalRaised?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Investors</span>
                  <span className="text-white font-bold">{fundingStats.totalInvestors}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Progress</span>
                    <span className="text-white font-bold">{fundingStats.fundingProgress?.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${Math.min(fundingStats.fundingProgress || 0, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {project.status === 'draft' && (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Project
                  </Button>

                  {!showRejectForm ? (
                    <Button
                      onClick={() => setShowRejectForm(true)}
                      variant="outline"
                      className="w-full border-red-600 text-red-300 hover:bg-red-600/20"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Project
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Reason for rejection (optional)"
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder:text-slate-400"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleReject}
                          disabled={isProcessing}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => setShowRejectForm(false)}
                          variant="outline"
                          className="flex-1 border-slate-600 text-slate-300"
                        >
                          Cancel
                        </Button>
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
