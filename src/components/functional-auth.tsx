import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuthRTK";
import { LogIn, UserPlus, Mail, Lock, User, TrendingUp } from "lucide-react";
import SLogo from "@/components/s-logo";
import ArtistRegistration from "@/components/artist-registration";
import InvestorRegistration from "@/components/investor-registration";

interface FunctionalAuthProps {
  onClose?: () => void;
}

export default function FunctionalAuth({ onClose }: FunctionalAuthProps) {
  const { toast } = useToast();
  const { login, register, isLoginLoading, isRegisterLoading } = useAuth();
  const [showArtistRegistration, setShowArtistRegistration] = useState(false);
  const [showInvestorRegistration, setShowInvestorRegistration] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    role: "investor"
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Frontend login attempt:", loginData);
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Login Failed",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log("FRONTEND - About to call login with:", loginData);
      const result = await login({ email: loginData.email, password: loginData.password });
      console.log("FRONTEND - Login result:", result);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in to SPARK",
      });
      onClose?.();
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(registerData);
      toast({
        title: "Account Created!",
        description: "Welcome to SPARK! Your account has been created successfully.",
      });
      onClose?.();
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
          <TabsTrigger value="login" className="data-[state=active]:bg-purple-500">
            Sign In
          </TabsTrigger>
          <TabsTrigger value="register" className="data-[state=active]:bg-purple-500">
            Sign Up
          </TabsTrigger>
          <TabsTrigger value="specialized" className="data-[state=active]:bg-cyan-500">
            Join Platform
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-white">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="login-password" className="text-white">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoginLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isLoginLoading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={async () => {
                      console.log("DEMO INVESTOR - Clearing localStorage and attempting login");
                      localStorage.clear();
                      
                      // Direct API call to bypass any frontend caching issues
                      try {
                        const response = await fetch("/api/auth/login", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: "demo@spark.com", password: "demo123" }),
                          credentials: "include"
                        });
                        
                        if (response.ok) {
                          const data = await response.json();
                          console.log("DEMO INVESTOR - Direct API login successful:", data);
                          
                          // Force reload to clear any cached state
                          window.location.reload();
                        } else {
                          const error = await response.text();
                          console.error("DEMO INVESTOR - API login failed:", error);
                          toast({
                            title: "Demo Login Failed",
                            description: "Authentication error",
                            variant: "destructive"
                          });
                        }
                      } catch (error: any) {
                        console.error("DEMO INVESTOR - Network error:", error);
                        toast({
                          title: "Demo Login Failed",
                          description: "Network error",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    Demo Investor
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={async () => {
                      console.log("DEMO ARTIST - Clearing localStorage and attempting login");
                      localStorage.clear();
                      
                      // Direct API call to bypass any frontend caching issues
                      try {
                        const response = await fetch("/api/auth/login", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: "artist@spark.com", password: "artist123" }),
                          credentials: "include"
                        });
                        
                        if (response.ok) {
                          const data = await response.json();
                          console.log("DEMO ARTIST - Direct API login successful:", data);
                          
                          // Force reload to clear any cached state
                          window.location.reload();
                        } else {
                          const error = await response.text();
                          console.error("DEMO ARTIST - API login failed:", error);
                          toast({
                            title: "Demo Login Failed",
                            description: "Authentication error",
                            variant: "destructive"
                          });
                        }
                      } catch (error: any) {
                        console.error("DEMO ARTIST - Network error:", error);
                        toast({
                          title: "Demo Login Failed",
                          description: "Network error",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    Demo Artist
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-username" className="text-white">
                    <User className="w-4 h-4 inline mr-1" />
                    Username
                  </Label>
                  <Input
                    id="register-username"
                    type="text"
                    value={registerData.username}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Choose a username"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="register-email" className="text-white">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="register-password" className="text-white">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Password
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Create a password"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="register-role" className="text-white">Account Type</Label>
                  <select
                    id="register-role"
                    value={registerData.role}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full mt-1 p-2 bg-slate-700 border border-slate-600 rounded text-white"
                  >
                    <option value="investor">Investor</option>
                    <option value="artist">Artist</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={isRegisterLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {isRegisterLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specialized">
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
                  Join as an Investor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Create a premium investor account with advanced analytics and AI-powered recommendations
                </p>
                <Button
                  onClick={() => setShowInvestorRegistration(true)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Join as Investor
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <SLogo className="mr-2 text-purple-400" size={20} />
                  Join as an Artist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Create an artist account to showcase your talent and connect with fans worldwide
                </p>
                <Button
                  onClick={() => setShowArtistRegistration(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <SLogo className="mr-2" size={16} />
                  Join as Artist
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Artist Registration Modal */}
      {showArtistRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <Button
              onClick={() => setShowArtistRegistration(false)}
              className="absolute top-4 right-4 z-10 bg-slate-700 hover:bg-slate-600"
              size="sm"
            >
              ×
            </Button>
            <ArtistRegistration onClose={() => setShowArtistRegistration(false)} />
          </div>
        </div>
      )}

      {/* Investor Registration Modal */}
      {showInvestorRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <Button
              onClick={() => setShowInvestorRegistration(false)}
              className="absolute top-4 right-4 z-10 bg-slate-700 hover:bg-slate-600"
              size="sm"
            >
              ×
            </Button>
            <InvestorRegistration onClose={() => setShowInvestorRegistration(false)} />
          </div>
        </div>
      )}
    </div>
  );
}