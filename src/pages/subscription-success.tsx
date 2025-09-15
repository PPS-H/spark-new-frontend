import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import SLogo from '@/components/s-logo';

const SubscriptionSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const handleContinue = () => {
    navigate('/settings');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <SLogo className="text-white" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to SPARK Pro!
          </CardTitle>
          <p className="text-muted-foreground text-center">
            Your subscription has been successfully activated. You now have access to all premium features.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* {sessionId && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Session ID: {sessionId}
              </p>
            </div>
          )} */}

          <div className="space-y-3">
            <Button 
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Go to Settings
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            
            <Button 
              onClick={handleGoHome}
              variant="outline"
              className="w-full"
            >
              Go to Homepage
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              You will receive a confirmation email shortly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
