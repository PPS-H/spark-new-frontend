import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import SLogo from '@/components/s-logo';

const SubscriptionCanceled: React.FC = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate('/settings');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-white" />
          </div>
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <SLogo className="text-white" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Subscription Canceled
          </CardTitle>
          <p className="text-muted-foreground text-center">
            Your subscription process was canceled. No charges have been made to your account.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What happened?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• You canceled the payment process</li>
              <li>• No subscription was created</li>
              <li>• No charges were made</li>
              <li>• You can try again anytime</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleTryAgain}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <RefreshCw className="mr-2 w-4 h-4" />
              Try Again
            </Button>
            
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Go Back
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionCanceled;
