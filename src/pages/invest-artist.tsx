import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  DollarSign,
  Lock,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGetProjectDetailsQuery, useLikeDislikeArtistMutation, useCreateCheckoutSessionMutation } from "@/store/features/api/labelApi";
import { useAuth } from "@/hooks/useAuthRTK";


export default function InvestArtistPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Mock toast function (replacing useToast)
  const toast = ({ title, description }: { 
    title: string; 
    description: string; 
  }) => {
    console.log(`Toast: ${title} - ${description}`);
    alert(`${title}: ${description}`);
  };

  const [investmentAmount, setInvestmentAmount] = useState(500);
  const [step, setStep] = useState(1); // 1: Amount, 2: Payment, 3: Confirmation

  // Fetch project details
  const {
    data: projectData,
    isLoading: isProjectLoading,
    error: projectError,
  } = useGetProjectDetailsQuery(
    { projectId: projectId || '' },
    { skip: !projectId }
  );

  // Like/Dislike artist mutation
  const [likeDislikeArtist, { isLoading: isLikeDislikeLoading }] = useLikeDislikeArtistMutation();
  
  // Create checkout session mutation
  const [createCheckoutSession, { isLoading: isCheckoutLoading }] = useCreateCheckoutSessionMutation();

  // Protection against undefined projectId
  if (!projectId) {
    console.log("❌ No project ID provided, redirecting to home");
    navigate("/");
    return null;
  }

  // Calculate investment share and expected return
  const calculateInvestmentDetails = (amount: number) => {
    if (!projectData?.data || amount <= 0) return { share: 0, expectedReturn: 0 };
    
    const { fundingProgress, artistPerformance } = projectData.data;
    // Calculate share based on the total project funding goal
    const share = (amount / fundingProgress.goal) * 100;
    const expectedReturn = (amount * artistPerformance.expectedROI) / 100;
    
    return { share, expectedReturn };
  };

  const { share, expectedReturn } = calculateInvestmentDetails(investmentAmount);

  // Check if user has already invested in this project
  const isAlreadyInvested = projectData?.data?.project?.artist?.isAlreadyInvested || false;

  const handleProceedToPayment = async () => {
    if (!investmentAmount || investmentAmount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid investment amount.",
      });
      return;
    }

    if (investmentAmount < minInvestment) {
      toast({
        title: "Amount Too Low",
        description: `Minimum investment is €${minInvestment}.`,
      });
      return;
    }

    if (investmentAmount > maxInvestment) {
      toast({
        title: "Amount Too High",
        description: `Maximum investment is €${maxInvestment}.`,
      });
      return;
    }

    if (!projectData?.data) {
      toast({
        title: "Project not found",
        description: "Unable to load project details.",
      });
      return;
    }

    try {
      // Create Stripe checkout session
      const result = await createCheckoutSession({
        projectId: projectId,
        amount: investmentAmount,
        currency: 'usd'
      }).unwrap();

      if (result.success && result.data.url) {
        // Redirect to Stripe checkout
        window.location.href = result.data.url;
      } else {
        toast({
          title: "Payment Error",
          description: "Failed to create checkout session. Please try again.",
        });
      }
    } catch (error) {
      console.error('Checkout session creation failed:', error);
      toast({
        title: "Payment Error",
        description: "Failed to create checkout session. Please try again.",
      });
    }
  };

  const handleLike = async () => {
    if (!projectData?.data?.project?.artist?._id) {
      return;
    }

    try {
      await likeDislikeArtist({ artistId: projectData.data.project.artist._id }).unwrap();
    } catch (error) {
      // Silent error handling - no toast notifications
      console.error('Failed to update like status:', error);
    }
  };

  // Loading state
  if (isProjectLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading project information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (projectError || !projectData?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load project details</p>
          <p className="text-gray-500 text-sm mb-4">Please try again later</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { project, artistPerformance, fundingProgress, investmentLimits } = projectData.data;
  const fundingProgressPercentage = fundingProgress.funded;
  const minInvestment = investmentLimits.min;
  const maxInvestment = Math.min(investmentLimits.max, investmentLimits.remaining);

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please log in to invest in projects</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // Check if user has Pro subscription for labels and investors
  if ((user.role === 'label' || user.role === 'investor') && !(user as any)?.isProMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Pro Subscription Required</h2>
          <p className="text-gray-400 mb-6">
            Pro subscription required to make investments. Please upgrade to Pro to access this feature.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/settings')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
            <Button 
              onClick={() => navigate("/")} 
              variant="outline"
              className="w-full"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Debug logging for project image
  console.log('🎯 InvestArtistPage project:', { 
    title: project.title, 
    image: project.image 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-white">
              Invest in {project.artistName}
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Artist Hero */}
        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
            {/* Project Image Background */}
            {project.image && (
              <div className="absolute inset-0">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.image}`}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {project.artistName}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-purple-500/20 text-purple-300">
                      {project.songTitle}
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-300">
                      {project.title}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLike}
                    disabled={isLikeDislikeLoading}
                    className={`border-pink-400 ${
                      project.artist.isLiked
                        ? "bg-pink-400 text-white"
                        : "text-pink-400 hover:bg-pink-400 hover:text-white"
                    }`}
                  >
                    {isLikeDislikeLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Heart
                        className={`w-4 h-4 ${project.artist.isLiked ? "fill-current" : ""}`}
                      />
                    )}
                  </Button>
                  {/* <Button
                    size="sm"
                    variant="outline"
                    onClick={handleMessage}
                    className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Artist Stats */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Artist Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {artistPerformance.monthlyListeners.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Monthly Listeners
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {artistPerformance.expectedROI}%
                    </div>
                    <div className="text-gray-400 text-sm">Expected ROI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {artistPerformance.riskLevel}
                    </div>
                    <div className="text-gray-400 text-sm">Risk Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {fundingProgressPercentage.toFixed(0)}%
                    </div>
                    <div className="text-gray-400 text-sm">Funded</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  About {project.artistName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {project.artist.artistBio || project.artist.aboutTxt || 'No description available.'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Funding Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Raised: €{fundingProgress.raised.toLocaleString()}
                    </span>
                    <span className="text-gray-400">
                      Goal: €{fundingProgress.goal.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(fundingProgressPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-white font-semibold">
                      {fundingProgressPercentage.toFixed(1)}% funded
                    </span>
                  </div>
                  <div className="text-center text-sm text-gray-400">
                    {fundingProgress.totalInvestors} investors
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Panel */}
          <div className="mb-20">
            <Card className="bg-slate-800 border-slate-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Invest Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {step === 1 && (
                  <>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Investment Amount (€)
                      </label>
                      <Input
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setInvestmentAmount(value);
                        }}
                        min={minInvestment}
                        max={maxInvestment}
                        disabled={isAlreadyInvested}
                        className={`bg-slate-700 border-slate-600 text-white ${
                          isAlreadyInvested 
                            ? 'opacity-50 cursor-not-allowed' 
                            : (investmentAmount > 0 && investmentAmount < minInvestment) || 
                              investmentAmount > maxInvestment
                                ? 'border-red-500 focus:border-red-500' 
                                : ''
                        }`}
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Min: €{minInvestment}</span>
                        <span>Max: €{maxInvestment}</span>
                      </div>
                      {(investmentAmount > 0 && investmentAmount < minInvestment) && (
                        <p className="text-red-400 text-xs mt-1">
                          Minimum investment is €{minInvestment}
                        </p>
                      )}
                      {investmentAmount > maxInvestment && (
                        <p className="text-red-400 text-xs mt-1">
                          Maximum investment is €{maxInvestment}
                        </p>
                      )}
                    </div>

                    {/* Quick investment amount buttons */}
                    <div className="space-y-2">
                      <label className="block text-gray-400 text-sm">
                        Quick Select
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[minInvestment, 500, 1000, 2000, 3000, maxInvestment]
                          .filter(amount => amount <= maxInvestment)
                          .map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setInvestmentAmount(amount)}
                            disabled={isAlreadyInvested}
                            className={`text-xs ${
                              isAlreadyInvested
                                ? 'opacity-50 cursor-not-allowed'
                                : investmentAmount === amount
                                  ? 'bg-purple-500 text-white border-purple-500'
                                  : 'border-gray-600 text-gray-300 hover:border-purple-400'
                            }`}
                          >
                            €{amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Your share:</span>
                        <span className="text-white font-semibold transition-all duration-300">
                          {share.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Expected return:</span>
                        <span className="text-green-400 font-semibold transition-all duration-300">
                          €{expectedReturn.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">ROI:</span>
                        <span className="text-cyan-400 font-semibold">
                          {artistPerformance.expectedROI}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Investment:</span>
                        <span className="text-purple-400 font-semibold transition-all duration-300">
                          €{investmentAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleProceedToPayment}
                      className={`w-full ${
                        isAlreadyInvested 
                          ? "bg-gray-500 cursor-not-allowed" 
                          : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      }`}
                      disabled={isAlreadyInvested || investmentAmount < minInvestment || investmentAmount > maxInvestment || investmentAmount === 0 || isCheckoutLoading}
                    >
                      {isCheckoutLoading 
                        ? "Creating Checkout..." 
                        : isAlreadyInvested 
                          ? "Already Invested" 
                          : "Continue to Payment"
                      }
                    </Button>

                    {isAlreadyInvested && (
                      <div className="mt-3 mb-20 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                        <p className="text-blue-300 text-sm text-center">
                          You have already invested in this project. Thank you for your support!
                        </p>
                      </div>
                    )}
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="bg-slate-700 rounded-lg p-4 space-y-2">
                      <h3 className="text-white font-semibold">
                        Investment Summary
                      </h3>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Amount:</span>
                        <span className="text-white">€{investmentAmount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Artist:</span>
                        <span className="text-white">{project.artistName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Your share:</span>
                        <span className="text-purple-400">
                          {share.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleProceedToPayment}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        Invest €{investmentAmount}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="w-full border-slate-600 text-gray-400"
                      >
                        Back
                      </Button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <div className="text-white text-2xl">✓</div>
                    </div>
                    <h3 className="text-white font-semibold">
                      Investment Successful!
                    </h3>
                    <p className="text-gray-400 text-sm">
                      You have successfully invested €{investmentAmount} in{" "}
                      {project.artistName}
                    </p>
                    <Button
                      onClick={() => navigate("/portfolio")}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      View Portfolio
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
