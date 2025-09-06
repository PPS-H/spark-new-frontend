import AutomatedPaymentDashboard from "@/components/automated-payment-dashboard";
import { useAuth } from "@/hooks/useAuthRTK";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <CardTitle className="text-white">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-400 mb-4">
              Please log in to access admin dashboard
            </p>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Restrict access to admin only
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
        <div className="max-w-2xl mx-auto p-4 pt-16">
          <Card className="bg-slate-800 border-red-700/50">
            <CardHeader className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <CardTitle className="text-white text-2xl">Access Restricted</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-gray-400 text-lg">
                This area is restricted to system administrators only
              </p>
              
              <div className="bg-slate-900 rounded-lg p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-red-400" />
                  <span className="text-white">Payment system management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-red-400" />
                  <span className="text-white">User account administration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-red-400" />
                  <span className="text-white">System monitoring and logs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-red-400" />
                  <span className="text-white">Compliance and security settings</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Your current role: <span className="text-white capitalize">{user?.role}</span>
                </p>
                <p className="text-sm text-red-400">
                  Contact system administrator for access requests
                </p>
              </div>

              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full border-gray-600 text-gray-300 hover:bg-slate-700"
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show admin dashboard only for admin users
  return <AutomatedPaymentDashboard />;
}