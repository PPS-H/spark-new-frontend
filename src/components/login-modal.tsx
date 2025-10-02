import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  useLoginMutation, 
  useSendOtpMutation, 
  useVerifyOtpMutation, 
  useForgotPasswordMutation 
} from "@/store/features/api/authApi";
import VerifyEmail from "./verify-email";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin?: (user: { id: number; username: string; email: string }) => void;
}

export default function LoginModal({
  open,
  onOpenChange,
}: LoginModalProps) {
  const { toast } = useToast();
  // RTK Query mutation hooks
  const [login, { isLoading }] = useLoginMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [forgotPassword, { isLoading: isResettingPassword }] = useForgotPasswordMutation();

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state (locally tracked, no backend)
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // Forgot password flow state
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'login' | 'email' | 'otp' | 'newPassword'>('login');
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState("");
  
  // Email verification state
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationData, setVerificationData] = useState<{
    email: string;
    userId: string;
  } | null>(null);

  // Note: Registration is now handled by dedicated forms on the homepage

  /** Login using RTK Query API */
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await login({
        email: loginEmail,
        password: loginPassword,
      }).unwrap();

      if (result.success && result.data?.token) {
        // Store the token in localStorage
        localStorage.setItem('token', result.data.token);
        
        toast({
          title: "Login Successful",
          description: "Welcome back to SPARK!",
        });
        
        setLoginEmail("");
        setLoginPassword("");
        onOpenChange(false);
        
        // User data will be automatically fetched by the getMe query
        // No need to reload the page
        window.location.reload();

      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Check if error is due to unverified email
      if (error?.data?.message?.includes("Email not verified")) {
        // Get user ID from error response or find user by email
        try {
          const otpResult = await sendOtp({
            email: loginEmail,
            type: 3 // Email verification type
          }).unwrap();
          
          setVerificationData({
            email: loginEmail,
            userId: otpResult.data._id,
          });
          setShowEmailVerification(true);
          
          toast({
            title: "Account Not Verified",
            description: "Your account is not verified. We sent you an OTP, please verify first.",
          });
          return;
        } catch (otpError) {
          console.error("Failed to send OTP:", otpError);
        }
      }
      
      let errorMessage = "Login failed. Please try again.";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  /** Handle register action - redirect to registration forms */
  const handleRegister = async () => {
    if (!registerUsername || !registerEmail || !registerPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // For now, show a message to use the dedicated registration forms
    // In the future, this could be integrated with the register API
    toast({
      title: "Registration",
      description: "Please use the registration forms on the homepage to create your account.",
    });
    
    // Clear form
    setRegisterUsername("");
    setRegisterEmail("");
    setRegisterPassword("");
  };

  // Demo login function removed - use real login instead

  /** Handle forgot password - send OTP */
  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await sendOtp({
        email: forgotEmail,
        type: 1
      }).unwrap();

      if (result.success) {
        setUserId(result.data._id);
        setForgotPasswordStep('otp');
        toast({
          title: "OTP Sent",
          description: "Please check your email for the verification code.",
        });
      }
    } catch (error: any) {
      console.error("Send OTP error:", error);
      
      let errorMessage = "Failed to send OTP. Please try again.";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  /** Handle OTP verification */
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 4-digit OTP.",
          variant: "destructive",
      });
      return;
    }

    try {
      const result = await verifyOtp({
        userId: userId,
        otp: parseInt(otp),
        type: 1
      }).unwrap();

      if (result.success) {
        setForgotPasswordStep('newPassword');
        toast({
          title: "OTP Verified",
          description: "Please enter your new password.",
        });
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      
      let errorMessage = "Invalid OTP. Please try again.";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }

      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  /** Handle new password submission */
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await forgotPassword({
        userId: userId,
        password: newPassword
      }).unwrap();

      if (result.success) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been updated. Please login with your new password.",
        });
        
        // Reset all forgot password states
        setForgotPasswordStep('login');
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setUserId("");
        
        // Close the modal
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      
      let errorMessage = "Failed to reset password. Please try again.";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }

      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  /** Reset forgot password flow */
  const resetForgotPasswordFlow = () => {
    setForgotPasswordStep('login');
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setUserId("");
  };

  // Show email verification screen if needed
  if (showEmailVerification && verificationData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-effect-dark border border-cyan-500/30 max-w-md animate-fade-in">
          <VerifyEmail
            email={verificationData.email}
            userId={verificationData.userId}
            onVerificationSuccess={() => {
              toast({
                title: "Email Verified!",
                description: "Your email has been verified. You can now log in.",
              });
              setShowEmailVerification(false);
              setVerificationData(null);
            }}
            onBack={() => {
              setShowEmailVerification(false);
              setVerificationData(null);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect-dark border border-cyan-500/30 max-w-md animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            {forgotPasswordStep === 'email' ? 'Forgot Password' : 
             forgotPasswordStep === 'otp' ? 'Verify OTP' : 
             forgotPasswordStep === 'newPassword' ? 'Reset Password' :
             'Welcome to SPARK'}
          </DialogTitle>
        </DialogHeader>

        {/* Forgot Password Flow - Email Step */}
        {forgotPasswordStep === 'email' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="forgot-email" className="text-gray-400">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="your@email.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="bg-slate-800 border-gray-600 text-white focus:border-cyan-400"
                onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()}
              />
            </div>
            <div className="space-y-2">
              <Button
                onClick={handleForgotPassword}
                disabled={isSendingOtp}
                className="w-full bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-semibold hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                aria-label="Send OTP"
              >
                {isSendingOtp ? "Sending OTP..." : "Send OTP"}
              </Button>
              <Button
                onClick={resetForgotPasswordFlow}
                variant="outline"
                className="w-full border-gray-600 text-gray-400 hover:bg-gray-800"
              >
                Back to Login
              </Button>
            </div>
          </div>
        )}

        {/* Forgot Password Flow - OTP Step */}
        {forgotPasswordStep === 'otp' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="otp" className="text-gray-400">Enter 4-digit OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="1234"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setOtp(value);
                }}
                className="bg-slate-800 border-gray-600 text-white focus:border-cyan-400 text-center text-2xl tracking-widest"
                onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                maxLength={4}
              />
            </div>
            <div className="space-y-2">
              <Button
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp || otp.length !== 4}
                className="w-full bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-semibold hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                aria-label="Verify OTP"
              >
                {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                onClick={() => setForgotPasswordStep('email')}
                variant="outline"
                className="w-full border-gray-600 text-gray-400 hover:bg-gray-800"
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Forgot Password Flow - New Password Step */}
        {forgotPasswordStep === 'newPassword' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-password" className="text-gray-400">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-slate-800 border-gray-600 text-white focus:border-cyan-400"
                onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-gray-400">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-slate-800 border-gray-600 text-white focus:border-cyan-400"
                onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
              />
            </div>
            <div className="space-y-2">
              <Button
                onClick={handleResetPassword}
                disabled={isResettingPassword}
                className="w-full bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-semibold hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                aria-label="Reset Password"
              >
                {isResettingPassword ? "Resetting..." : "Reset Password"}
              </Button>
              <Button
                onClick={() => setForgotPasswordStep('otp')}
                variant="outline"
                className="w-full border-gray-600 text-gray-400 hover:bg-gray-800"
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Login Form - only show if not in forgot password flow */}
        {forgotPasswordStep === 'login' && (
        <Tabs defaultValue="login" className="w-full">
          <TabsContent value="login" className="space-y-4">
            <div>
              <Label htmlFor="login-email" className="text-gray-400">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="your@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="bg-slate-800 border-gray-600 text-white focus:border-cyan-400"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div>
              <Label htmlFor="login-password" className="text-gray-400">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="bg-slate-800 border-gray-600 text-white focus:border-cyan-400"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div className="space-y-2">
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-semibold hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                aria-label="Login to your account"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
                <Button
                  onClick={() => setForgotPasswordStep('email')}
                  variant="ghost"
                  className="w-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
                >
                  Forgot Password?
                </Button>
            </div>
          </TabsContent>
          <TabsContent value="register" className="space-y-4">
            <div>
              <Label htmlFor="register-username" className="text-gray-400">Username</Label>
              <Input
                id="register-username"
                placeholder="Your username"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                className="bg-slate-800 border-gray-600 text-white focus:border-cyan-400"
              />
            </div>
            <div>
              <Label htmlFor="register-email" className="text-gray-400">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="your@email.com"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="bg-slate-800 border-gray-600 text-white focus:border-cyan-400"
              />
            </div>
            <div>
              <Label htmlFor="register-password" className="text-gray-400">Password</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="Create a password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="bg-slate-800 border-gray-600 text-white focus:border-cyan-400"
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
            </div>
            <Button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-semibold hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              aria-label="Create new account"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </TabsContent>
        </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
