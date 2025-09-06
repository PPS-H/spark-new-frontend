import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  DollarSign,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Zap
} from "lucide-react";
import type { Artist } from "@/types/artist";

interface FunctionalInvestmentProps {
  artist: Artist;
  onInvestmentComplete?: (investment: any) => void;
}

export default function FunctionalInvestment({ artist, onInvestmentComplete }: FunctionalInvestmentProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [investmentAmount, setInvestmentAmount] = useState(500);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Amount, 2: Payment, 3: Confirmation

  const minInvestment = 100;
  const maxInvestment = 10000;
  const fundingProgress = (parseFloat(artist.currentFunding) / parseFloat(artist.fundingGoal)) * 100;

  const investmentMutation = useMutation({
    mutationFn: async (data: { artistId: number; amount: number; paymentMethod: string }) => {
      const response = await apiRequest("POST", "/api/investments", data);
      return response.json();
    },
    onSuccess: (investment) => {
      toast({
        title: "Investment Successful!",
        description: `You've successfully invested €${investmentAmount} in ${artist.name}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/artists"] });
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      onInvestmentComplete?.(investment);
    },
    onError: (error: any) => {
      toast({
        title: "Investment Failed",
        description: error.message || "Unable to process investment",
        variant: "destructive"
      });
    }
  });

  const processInvestment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await investmentMutation.mutateAsync({
        artistId: artist.id,
        amount: investmentAmount,
        paymentMethod
      });
      
      setStep(3);
    } catch (error) {
      console.error("Investment processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const projectedReturn = Math.round(investmentAmount * 1.25); // 25% projected return
  const expectedTimeframe = "12-18 months";

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Investment Amount</h3>
              <p className="text-gray-400">Choose how much you want to invest in {artist.name}</p>
            </div>

            {/* Artist Info */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{artist.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{artist.name}</h4>
                    <p className="text-gray-400">{artist.genre} • {artist.country}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-300">{artist.monthlyStreams?.toLocaleString()} monthly streams</span>
                      <Badge className="bg-green-500/20 text-green-300">Rising</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Funding Progress</span>
                    <span>{Math.round(fundingProgress)}% complete</span>
                  </div>
                  <Progress value={fundingProgress} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>€{artist.currentFunding}</span>
                    <span>€{artist.fundingGoal}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amount Selection */}
            <div className="space-y-4">
              <Label className="text-white text-lg">Investment Amount</Label>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  €{investmentAmount.toLocaleString()}
                </div>
                <p className="text-gray-400">Minimum: €{minInvestment} • Maximum: €{maxInvestment}</p>
              </div>

              <Slider
                value={[investmentAmount]}
                onValueChange={(value) => setInvestmentAmount(value[0])}
                min={minInvestment}
                max={maxInvestment}
                step={50}
                className="w-full"
              />

              <div className="grid grid-cols-4 gap-2">
                {[250, 500, 1000, 2500].map(amount => (
                  <Button
                    key={amount}
                    variant={investmentAmount === amount ? "default" : "outline"}
                    onClick={() => setInvestmentAmount(amount)}
                    className="border-slate-700"
                  >
                    €{amount}
                  </Button>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Math.max(minInvestment, Math.min(maxInvestment, parseInt(e.target.value) || 0)))}
                  min={minInvestment}
                  max={maxInvestment}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
                <Button
                  onClick={() => setStep(2)}
                  disabled={investmentAmount < minInvestment}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  Continue
                </Button>
              </div>
            </div>

            {/* Investment Projection */}
            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <h4 className="font-semibold text-white">Projected Returns</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xl font-bold text-green-400">€{projectedReturn.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Estimated value</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-400">+25%</div>
                    <div className="text-sm text-gray-400">Expected return</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Expected timeframe: {expectedTimeframe}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Payment Method</h3>
              <p className="text-gray-400">Choose how you'd like to complete your €{investmentAmount} investment</p>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "card" 
                    ? "border-purple-500 bg-purple-500/10" 
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-purple-400" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">Credit/Debit Card</h4>
                    <p className="text-sm text-gray-400">Secure payment via Stripe</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300">Instant</Badge>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "bank" 
                    ? "border-purple-500 bg-purple-500/10" 
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                }`}
                onClick={() => setPaymentMethod("bank")}
              >
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-blue-400" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">Bank Transfer</h4>
                    <p className="text-sm text-gray-400">Direct bank transfer</p>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-300">1-2 days</Badge>
                </div>
              </div>
            </div>

            {/* Investment Summary */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Artist</span>
                  <span className="text-white">{artist.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Investment Amount</span>
                  <span className="text-white">€{investmentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Processing Fee</span>
                  <span className="text-white">€0 (No fees)</span>
                </div>
                <div className="border-t border-slate-700 pt-3">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-white">€{investmentAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="flex items-center space-x-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <Shield className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-white font-medium">Secure Payment</p>
                <p className="text-sm text-gray-400">Your payment is protected by bank-level encryption</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-slate-700">
                Back
              </Button>
              <Button
                onClick={processInvestment}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
              >
                {isProcessing ? "Processing..." : "Confirm Investment"}
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Investment Successful!</h3>
              <p className="text-gray-400">
                You've successfully invested €{investmentAmount} in {artist.name}
              </p>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Investment ID</span>
                    <span className="text-white">#INV-{Date.now()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-white">€{investmentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <Badge className="bg-green-500/20 text-green-300">Confirmed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-gray-400">
              You'll receive updates on your investment via email and in your portfolio dashboard.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (isProcessing) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Processing Investment...</h3>
          <p className="text-gray-400">Please don't close this window</p>
        </div>
        <div className="max-w-md mx-auto">
          <Progress value={66} className="h-2" />
          <p className="text-sm text-gray-400 mt-2">Verifying payment and updating portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {renderStepContent()}
    </div>
  );
}