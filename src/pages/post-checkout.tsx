import { useEffect, useState } from "react";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Zap,
  Crown,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SLogo from "@/components/s-logo";
import { useAuth } from "@/hooks/useAuthRTK";
import { Heart, Building } from "lucide-react";

export default function PostCheckoutPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const roles = [
    {
      id: "fan",
      title: "Fan",
      description: "Connect with your favorite artists and discover new music",
      price: "Free",
      icon: Heart,
      gradient: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/30",
      iconBg: "from-blue-500 to-cyan-500",
      features: [
        "Browse global artists",
        "Smart investment tools",
        "Portfolio tracking",
        "Early access to talent",
      ],
    },
    {
      id: "artist",
      title: "Artist",
      description: "Build your career and connect with fans",
      price: "39.99",
      icon: SLogo,
      gradient: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-500/30",
      iconBg: "from-purple-500 to-pink-500",
      features: [
        "Professional dashboard",
        "Funding campaigns",
        "Fan analytics",
        "Platform integration",
      ],
    },
    {
      id: "label",
      title: "Label",
      description: "Discover and sign talented artists",
      price: "279",
      icon: Building,
      gradient: "from-yellow-500/10 to-orange-500/10",
      border: "border-yellow-500/30",
      iconBg: "from-yellow-500 to-orange-500",
      features: [
        "Advanced artist discovery",
        "Direct contact tools",
        "Market intelligence",
        "Exclusive access",
      ],
    },
  ];
  const [planDetails, setPlanDetails] = useState<{
    name: string;
    features: string[];
  } | null>(null);
  const { user } = useAuth();

  const getPlanFeatures = (role: string) => {
    const roleData = roles.find((r) => r.id === role);
    return roleData ? roleData.features : [];
  };

  useEffect(() => {
    const email = localStorage.getItem("email");

    fetch("/api/auth/session-from-stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();

        const data = await res.json();
        setPlanDetails({
          name: data.user.role || "Pro Plan",
          features: getPlanFeatures(data.user.role) || [
            "Full artist analytics",
            "Premium badge",
            "Early access to features",
            "Priority support",
          ],
        });

        setStatus("success");
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      })
      .catch(() => {
        setStatus("error");
        console.error("Failed to fetch session from Stripe");
        setPlanDetails(null);
      });
  }, []);

  const getRoleInfo = () => {
    if (!user) return { name: "Free User", color: "gray" };

    const roleData = {
      fan: { name: "Free User", color: "gray" },
      user: { name: "Free User", color: "gray" },
      artist: { name: "Artist Pro", color: "purple" },
      investor: { name: "Investor Pro", color: "blue" },
      label: { name: "Label Pro", color: "green" },
      admin: { name: "Admin", color: "red" },
    };

    return roleData[user.role as keyof typeof roleData] || roleData.fan;
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <SLogo className="text-purple-500" size={40} />
          <h1 className="text-3xl font-bold text-white">SPARK</h1>
        </div>

        {/* Main Card */}
        <Card className="artist-metric-card border-slate-700">
          <CardHeader className="text-center">
            {status === "loading" && (
              <Loader2
                className="animate-spin mx-auto text-purple-400 mb-2"
                size={40}
              />
            )}
            {status === "success" && (
              <CheckCircle2 className="mx-auto text-green-400 mb-2" size={40} />
            )}
            {status === "error" && (
              <XCircle className="mx-auto text-red-400 mb-2" size={40} />
            )}

            <CardTitle className="text-white">
              {status === "loading" && "Processing your subscription..."}
              {status === "success" && "Subscription Successful!"}
              {status === "error" && "Subscription Failed"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {status === "loading" && (
              <p className="text-gray-400 text-center">
                Please wait while we finalize your subscription details...
              </p>
            )}

            {status === "success" && planDetails && (
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <Badge
                    className={`${
                      roleInfo.color === "purple"
                        ? "bg-purple-500/20 text-purple-300"
                        : roleInfo.color === "blue"
                        ? "bg-blue-500/20 text-blue-300"
                        : roleInfo.color === "green"
                        ? "bg-green-500/20 text-green-300"
                        : roleInfo.color === "red"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-gray-500/20 text-gray-300"
                    } text-lg py-1.5 px-4`}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    {planDetails.name}
                  </Badge>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                    Your New Benefits:
                  </h3>
                  <ul className="space-y-2">
                    {planDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Sparkles className="w-4 h-4 mt-1 mr-2 text-purple-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center text-gray-400">
                  You'll be redirected to your dashboard shortly...
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4 text-center">
                <p className="text-red-400">
                  Something went wrong while processing your subscription.
                </p>
                <p className="text-gray-400">
                  Please try again or contact support if the issue persists.
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => (window.location.href = "/")}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
