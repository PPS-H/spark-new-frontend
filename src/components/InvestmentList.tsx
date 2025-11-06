import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetInvestedProjectsQuery } from "@/store/features/api/labelApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, DollarSign, TrendingUp, User, Music, Target, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function InvestmentList() {
  const { t } = useTranslation();
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
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <div className="text-white text-lg font-medium mt-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {t('labelPortfolio.loadingInvestments')}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">!</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{t('labelPortfolio.failedToLoadInvestments')}</h3>
        <p className="text-gray-400 text-center max-w-md">
          Something went wrong while loading your investments. Please try again later.
        </p>
      </div>
    );
  }

  if (!investedProjectsData?.data?.projects || investedProjectsData.data.projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div 
          className="mb-8 p-8 rounded-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
            border: '1px solid rgba(122, 90, 248, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {t('labelPortfolio.noInvestmentsYet')}
          </h3>
          <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
            {t('labelPortfolio.noInvestmentsDescription')}
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
          >
            {t('labelPortfolio.startInvesting')}
          </Button>
        </div>
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
    <div className="space-y-8">
      {/* Projects Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
        {projects.map((project) => (
          <Card 
            key={project._id} 
            className="group relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardContent className="p-8 relative z-10">
              {/* Project Image */}
              {project.image && (
                <div className="mb-6 overflow-hidden rounded-2xl relative">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.image}`}
                    alt={project.title}
                    className="w-full h-56 object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              
              {/* Header with Artist Info and Status */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16 border-2 border-purple-500/30 shadow-lg">
                      <img 
                        src={getDummyProfileImage(project.userId.username)} 
                        alt={project.userId.username}
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-purple-500 to-pink-500">
                        {project.userId.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm font-medium mb-1">
                      by {project.artistName} • {project.userId.favoriteGenre}
                    </p>
                    <p className="text-gray-400 text-xs flex items-center">
                      <User className="w-3 h-3 mr-2 text-purple-400" />
                      {project.userId.username} • {project.userId.country}
                    </p>
                  </div>
                </div>
                <Badge 
                  className={`${getStatusColor(project.status)} px-4 py-2 capitalize text-sm font-semibold rounded-full shadow-lg`}
                  style={{
                    boxShadow: project.status === 'active' 
                      ? '0 4px 16px rgba(34, 197, 94, 0.3)' 
                      : project.status === 'pending'
                      ? '0 4px 16px rgba(234, 179, 8, 0.3)'
                      : '0 4px 16px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  {project.status}
                </Badge>
              </div>

              {/* Project Details */}
              <div className="mb-6">
                <p className="text-gray-300 text-sm mb-4 line-clamp-2 capitalize leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                      <Music className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="font-medium">{project.songTitle}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                      <Clock className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="font-medium">{project.duration} days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg">
                      <Calendar className="w-4 h-4 text-orange-400" />
                    </div>
                    <span className="font-medium">{formatDate(project.expectedReleaseDate)}</span>
                  </div>
                </div>
              </div>

              {/* Investment Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div 
                  className="text-center p-4 bg-gradient-to-br from-slate-800/40 to-slate-700/30 rounded-2xl border border-slate-600/20 hover:border-green-500/30 transition-all duration-300 group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <p className="text-lg font-bold text-white group-hover:text-green-300 transition-colors">${project.fundingGoal.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 font-medium">{t('labelPortfolio.fundingGoal')}</p>
                </div>
                <div 
                  className="text-center p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                    boxShadow: '0 4px 16px rgba(6, 182, 212, 0.1)'
                  }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <p className="text-lg font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">{project.expectedROIPercentage}%</p>
                  <p className="text-xs text-gray-400 font-medium">{t('labelPortfolio.expectedROI')}</p>
                </div>
                <div 
                  className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                    boxShadow: '0 4px 16px rgba(147, 51, 234, 0.1)'
                  }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <p className="text-lg font-bold text-purple-400 group-hover:text-purple-300 transition-colors capitalize">{project.releaseType}</p>
                  <p className="text-xs text-gray-400 font-medium">{t('labelPortfolio.releaseType')}</p>
                </div>
                <div 
                  className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-2xl border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 179, 8, 0.1) 100%)',
                    boxShadow: '0 4px 16px rgba(249, 115, 22, 0.1)'
                  }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-orange-400 group-hover:text-orange-300 transition-colors">{formatDate(project.fundingDeadline)}</p>
                  <p className="text-xs text-gray-400 font-medium">{t('labelPortfolio.deadline')}</p>
                </div>
              </div>

              {/* Verification Status */}
              {project.isVerified && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-600/20 mb-6">
                  <div className="flex items-center text-green-400 text-sm font-medium">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    {t('labelPortfolio.verifiedProject')}
                  </div>
                  <div className="text-gray-400 text-xs font-medium">
                    {t('labelPortfolio.verifiedOn')} {formatDate(project.verifiedAt)}
                  </div>
                </div>
              )}

              {/* View Details Button */}
              <div className="pt-2">
                <Button
                  onClick={() => navigate(`/invest/${project._id}`)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                >
                  {t('labelPortfolio.viewDetails')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-6 pt-8">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="outline"
            className="border-purple-500/30 text-gray-300 hover:bg-purple-500/20 hover:border-purple-400/50 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('labelPortfolio.previous')}
          </Button>
          <div 
            className="flex items-center space-x-3 px-6 py-3 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              border: '1px solid rgba(122, 90, 248, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
          >
            <span className="text-gray-300 text-sm font-medium">
              {t('labelPortfolio.pageOf', { current: currentPage, total: pagination.totalPages })}
            </span>
          </div>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages}
            variant="outline"
            className="border-purple-500/30 text-gray-300 hover:bg-purple-500/20 hover:border-purple-400/50 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('labelPortfolio.next')}
          </Button>
        </div>
      )}
    </div>
  );
}
