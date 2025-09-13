import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StripeConnectFailed() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/settings");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Stripe Connection Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-300">
            We couldn't connect your Stripe account. This might be due to incomplete information or a temporary issue.
          </p>
          
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h3 className="text-red-400 font-semibold mb-2">Common Issues:</h3>
            <ul className="text-sm text-gray-300 space-y-1 text-left">
              <li>• Incomplete account information</li>
              <li>• Network connectivity issues</li>
              <li>• Stripe service temporarily unavailable</li>
              <li>• Account verification requirements not met</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleRetry}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
