import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StripeConnectSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Stripe Connected Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-300">
            Your Stripe account has been successfully connected. You can now receive payments for your projects and investments.
          </p>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h3 className="text-green-400 font-semibold mb-2">What's Next?</h3>
            <ul className="text-sm text-gray-300 space-y-1 text-left">
              <li>• You can now receive payments from investors</li>
              <li>• Funds will be automatically transferred to your bank account</li>
              <li>• Check your Stripe dashboard for transaction details</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate("/settings")}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Go to Settings
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
