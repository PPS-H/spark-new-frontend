import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/store/features/api/authApi";

interface VerifyEmailProps {
  email: string;
  userId: string;
  onVerificationSuccess?: () => void;
  onBack?: () => void;
}

export default function VerifyEmail({ 
  email, 
  userId, 
  onVerificationSuccess,
  onBack 
}: VerifyEmailProps) {
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

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
        toast({
          title: "Email Verified!",
          description: "Your email has been successfully verified.",
        });
        onVerificationSuccess?.();
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

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await sendOtp({
        email: email,
        type: 4 // Resend email verification type
      }).unwrap();

      toast({
        title: "OTP Resent",
        description: "A new email verification OTP has been sent to your email.",
      });
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      
      let errorMessage = "Failed to resend OTP. Please try again.";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }

      toast({
        title: "Resend Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <p className="text-gray-600 mt-2">
          We've sent a verification code to{" "}
          <span className="font-semibold text-blue-600">{email}</span>
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="otp">Enter Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 4-digit code"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 4);
              setOtp(value);
            }}
            className="text-center text-lg tracking-widest"
            maxLength={4}
          />
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleVerifyOtp}
            disabled={isVerifyingOtp || otp.length !== 4}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifyingOtp ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>

          <Button
            onClick={handleResendOtp}
            disabled={isResending || isSendingOtp}
            variant="outline"
            className="w-full"
          >
            {isResending || isSendingOtp ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Code
              </>
            )}
          </Button>

          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Didn't receive the code? Check your spam folder or</p>
          <button
            onClick={handleResendOtp}
            disabled={isResending || isSendingOtp}
            className="text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
          >
            resend it
          </button>
        </div>
      </CardContent>
    </Card>
  );
}