import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  CreditCard,
  Building,
  Smartphone,
  X,
  CheckCircle,
  TrendingUp,
  Shield,
  FileText,
  Zap,
  Lock,
  Crown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuthRTK";
import type { Artist } from "@/types/artist";

interface InvestmentModalProps {
  artist: Artist;
  isOpen: boolean;
  onClose: () => void;
  onInvest: (amount: number, method: string) => void;
}

export default function InvestmentModal({
  artist,
  isOpen,
  onClose,
  onInvest,
}: InvestmentModalProps) {
  const { user, isAuthenticated } = {
    user: {
      role: "investor",
    },
    isAuthenticated: true,
  };
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [jurisdiction, setJurisdiction] = useState("US");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useLanguage();

  // Check if user can invest (EVERYONE can invest except artists)
  const canInvest = user?.role && user.role !== "artist";
  const isPaidUser = true; // All users can invest - remove restrictions

  const fundingProgress = Math.round(
    (parseFloat(artist.currentFunding) / parseFloat(artist.fundingGoal)) * 100
  );
  const monthlyListenersFormatted =
    (artist.monthlyListeners / 1000000).toFixed(1) + "M";

  // Mock toast function (replacing useToast)
  const toast = (options: {
    title: string;
    description: string;
    variant?: string;
  }) => {
    console.log(`Toast: ${options.title} - ${options.description}`);
    alert(`${options.title}: ${options.description}`);
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 10) {
      setAmount(numValue);
    }
  };

  const handleProceedToPayment = () => {
    if (!amount || amount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid investment amount.",
        variant: "destructive",
      });
      return;
    }

    if (!jurisdiction) {
      toast({
        title: "Jurisdiction Required",
        description: "Please select your jurisdiction.",
        variant: "destructive",
      });
      return;
    }

    // Mock redirect to checkout page
    console.log(
      "🚀 MOCK REDIRECT TO PAYMENT:",
      `/checkout/${artist.id}/${amount}`
    );
    navigate(`/checkout/${artist.id}/${amount}`);
    onClose(); // Close modal immediately
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    const investmentData = {
      userId: user?.id || 0,
      projectId: artist.id,
      amount: amount.toString(),
      sharePercentage: (
        (amount / parseFloat(artist.fundingGoal)) *
        100
      ).toFixed(2),
      currentValue: amount.toString(),
      totalReturns: "0",
      status: "active",
      contractId: null,
      escrowReleased: false,
      paymentMethod,
      jurisdiction,
      expectedReturn: artist.expectedReturn,
      payment_intent_id: paymentIntentId,
    };

    // Mock investment success flow
    onInvest(amount, paymentMethod);

    toast({
      title: "Investment Successful!",
      description: "Investment processed. Redirecting to portfolio.",
    });

    setTimeout(() => {
      onClose();
      setStep(1);
      setIsSuccess(false);
    }, 1500);
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    toast({
      title: "Payment Failed",
      description: error || "Payment processing failed. Please try again.",
      variant: "destructive",
    });
    setIsProcessing(false);
  };

  console.log("The step is :", step);

  const handleInvestment = async () => {
    setIsProcessing(true);

    try {
      // Mock payment processing
      if (paymentMethod === "card") {
        console.log(
          "🚀 MOCK PAYMENT: Creating simulated payment intent for",
          amount,
          "USD"
        );

        // Simulate payment processing delay
        setTimeout(() => {
          // Mock successful payment
          const mockPaymentIntentId = `pi_mock_${Date.now()}`;
          handlePaymentSuccess(mockPaymentIntentId);
          setIsProcessing(false);
        }, 2000);
      } else {
        // For other payment methods, proceed with mock flow
        const investmentData = {
          userId: user?.id || 0,
          projectId: artist.id,
          amount: amount.toString(),
          sharePercentage: (
            (amount / parseFloat(artist.fundingGoal)) *
            100
          ).toFixed(2),
          currentValue: amount.toString(),
          totalReturns: "0",
          status: "active",
          contractId: null,
          escrowReleased: false,
          paymentMethod,
          jurisdiction,
          expectedReturn: artist.expectedReturn,
          payment_intent_id: null,
        };

        // Mock investment processing
        setTimeout(() => {
          onInvest(amount, paymentMethod);
          setIsProcessing(false);
          setIsSuccess(true);
        }, 2000);
      }
    } catch (error: any) {
      console.error("Payment setup failed:", error);
      setIsProcessing(false);

      toast({
        title: t("investment.payment_error"),
        description: "Mock payment processing - this is a demo.",
        variant: "destructive",
      });
    }
  };

  const resetModal = () => {
    setStep(1);
    setAmount(100);
    setPaymentMethod("card");
    setIsProcessing(false);
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] bg-gray-900 border-gray-800 p-0 m-4 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <DialogTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-400" />
              {t("investment.title")} {artist.name}
            </span>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Access Control for Free Users */}
          {!isAuthenticated ? (
            <div className="text-center py-8 space-y-6">
              <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Authentication Required
              </h3>
              <p className="text-gray-400 mb-4">
                Please log in to make investments
              </p>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          ) : !canInvest ? (
            <div className="text-center py-8 space-y-6">
              <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Artists Cannot Invest
              </h3>
              <p className="text-gray-400 mb-4">
                Artists cannot invest in other artists. You can only receive
                investments for your own projects.
              </p>

              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <h4 className="text-white font-semibold">
                  As an Artist, you can:
                </h4>
                <div className="text-left space-y-2">
                  <div className="text-gray-300">
                    • Create and promote your music projects
                  </div>
                  <div className="text-gray-300">
                    • Receive investments from fans and investors
                  </div>
                  <div className="text-gray-300">
                    • Access advanced analytics and promotion tools
                  </div>
                  <div className="text-gray-300">
                    • Connect with your audience directly
                  </div>
                </div>
              </div>

              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Artist Info */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={artist.imageUrl || "/default-artist.png"}
                      alt={artist.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-bold">{artist.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {artist.genre} • {artist.country}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="text-sm">
                          <span className="text-gray-400">
                            Monthly Listeners:
                          </span>
                          <span className="text-white ml-1">
                            {monthlyListenersFormatted}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400">
                            Expected Return:
                          </span>
                          <span className="text-green-400 ml-1">
                            {artist.expectedReturn}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span>Funding Progress</span>
                      <span className="text-cyan-400">{fundingProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${fundingProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-400">
                        ${parseInt(artist.currentFunding).toLocaleString()}{" "}
                        raised
                      </span>
                      <span className="text-gray-500">
                        ${parseInt(artist.fundingGoal).toLocaleString()} goal
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount" className="text-white mb-2 block">
                      Investment Amount (USD)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      min="10"
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Enter amount"
                    />
                    <p className="text-gray-400 text-sm mt-1">
                      Minimum investment: $10
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={amount === 50 ? "default" : "outline"}
                      className={
                        amount === 50
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "border-gray-600 text-gray-300"
                      }
                      onClick={() => setAmount(50)}
                    >
                      $50
                    </Button>
                    <Button
                      variant={amount === 100 ? "default" : "outline"}
                      className={
                        amount === 100
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "border-gray-600 text-gray-300"
                      }
                      onClick={() => setAmount(100)}
                    >
                      $100
                    </Button>
                    <Button
                      variant={amount === 500 ? "default" : "outline"}
                      className={
                        amount === 500
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "border-gray-600 text-gray-300"
                      }
                      onClick={() => setAmount(500)}
                    >
                      $500
                    </Button>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-white font-medium">
                        Investment Summary
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Investment Amount:
                        </span>
                        <span className="text-white">${amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected Return:</span>
                        <span className="text-green-400">
                          {artist.expectedReturn}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk Level:</span>
                        <span
                          className={`${
                            artist.riskLevel === "Low"
                              ? "text-green-400"
                              : artist.riskLevel === "Medium"
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {artist.riskLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    onClick={() => setStep(2)}
                    disabled={amount < 10}
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-white mb-3 block">
                      Payment Method
                    </Label>
                    <div className="space-y-2">
                      <Button
                        variant={
                          paymentMethod === "card" ? "default" : "outline"
                        }
                        className={`w-full justify-start ${
                          paymentMethod === "card"
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "border-gray-600 text-gray-300 hover:bg-gray-800"
                        }`}
                        onClick={() => setPaymentMethod("card")}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Credit/Debit Card
                      </Button>
                      <Button
                        variant={
                          paymentMethod === "bank" ? "default" : "outline"
                        }
                        className={`w-full justify-start ${
                          paymentMethod === "bank"
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "border-gray-600 text-gray-300 hover:bg-gray-800"
                        }`}
                        onClick={() => setPaymentMethod("bank")}
                      >
                        <Building className="w-4 h-4 mr-2" />
                        Bank Transfer
                      </Button>
                      <Button
                        variant={
                          paymentMethod === "mobile" ? "default" : "outline"
                        }
                        className={`w-full justify-start ${
                          paymentMethod === "mobile"
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "border-gray-600 text-gray-300 hover:bg-gray-800"
                        }`}
                        onClick={() => setPaymentMethod("mobile")}
                      >
                        <Smartphone className="w-4 h-4 mr-2" />
                        Mobile Payment
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="jurisdiction"
                      className="text-white mb-2 block"
                    >
                      Jurisdiction
                    </Label>
                    <Select
                      value={jurisdiction}
                      onValueChange={setJurisdiction}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States (SEC)</SelectItem>
                        <SelectItem value="UK">United Kingdom (FCA)</SelectItem>
                        <SelectItem value="FR">France (AMF)</SelectItem>
                        <SelectItem value="DE">Germany (BaFin)</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-gray-400 text-sm mt-1">
                      Investment governed by this jurisdiction's regulations
                    </p>
                  </div>

                  {/* Mock Payment Security Notice */}
                  {paymentMethod === "card" && (
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">
                          Mock Secure Payment
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-green-200">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-3 h-3" />
                          <span>Demo payment processing</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-3 h-3" />
                          <span>Simulated security features</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Lock className="w-3 h-3" />
                          <span>Mock encryption enabled</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Automated Features Notice */}
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">
                        100% Demo System
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-blue-200">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-3 h-3" />
                        <span>Simulated KYC/AML verification</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3 h-3" />
                        <span>Mock contract generation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-3 h-3" />
                        <span>Simulated revenue redistribution</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">
                      Order Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Artist:</span>
                        <span className="text-white">{artist.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Investment:</span>
                        <span className="text-white">${amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing Fee:</span>
                        <span className="text-white">$0</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-white">Total:</span>
                          <span className="text-white">${amount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                      onClick={handleProceedToPayment}
                      disabled={isProcessing}
                    >
                      {isProcessing
                        ? "Processing..."
                        : "Proceed to Mock Checkout"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Success State */}
              {isSuccess && (
                <div className="text-center py-8 space-y-6">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Investment Successful!
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Your mock investment of ${amount} in {artist.name} has been
                    processed.
                  </p>
                  <Button onClick={handleClose} className="w-full">
                    Continue
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
