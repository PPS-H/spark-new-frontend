import { useState } from "react";
import {
  Play,
  TrendingUp,
  Shield,
  Globe,
  Crown,
  Star,
  ChevronRight,
} from "lucide-react";
import SLogo from "@/components/s-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoginModal from "@/components/login-modal";
import RoleSelection from "@/components/role-selection";
import FanRegistration from "@/components/fan-registration";
import { useAuth } from "@/hooks/useAuthRTK";

export default function MarketingHome() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showFanRegistration, setShowFanRegistration] = useState(false);
  const { login } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    setShowRoleSelection(false);

    if (role === "artist") {
      // Navigate to artist registration page
      window.location.href = "/artist-register";
    } else if (role === "fan") {
      // Navigate to fan registration page
      window.location.href = "/fan-register";
    } else if (role === "label") {
      // Navigate to label registration page
      window.location.href = "/label-register";
    } else {
      // Fallback to login modal
      setShowLoginModal(true);
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Smart Investments",
      description:
        "AI-powered recommendations to discover the next big artists before they break mainstream",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Access artists from every corner of the world across all genres and cultural scenes",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description:
        "Bank-grade security with transparent investment tracking and verified artist profiles",
    },
  ];

  const pricingTiers = [
    {
      name: "Free Fan",
      price: "€0",
      period: "/forever",
      features: [
        "Discover artists",
        "Follow favorites",
        "Basic playlists",
        "Community access",
      ],
      cta: "Join Free",
      popular: false,
      role: "fan",
    },
    // {
    //   name: "Premium Investor",
    //   price: "€279",
    //   period: "/month",
    //   features: ["Advanced analytics", "Priority access", "Direct artist contact", "Portfolio management"],
    //   cta: "Start Premium",
    //   popular: true,
    //   role: "investor"
    // },
    {
      name: "Artist Pro",
      price: "€39.99",
      period: "/month",
      features: [
        "Control hub",
        "Campaign tools",
        "Fan analytics",
        "Platform integration",
      ],
      cta: "Launch Career",
      popular: false,
      role: "artist",
    },
    {
      name: "Label Suite",
      price: "€279",
      period: "/month",
      features: [
        "Artist discovery",
        "Market intelligence",
        "Direct contact tools",
        "Exclusive access",
      ],
      cta: "Join as Label",
      popular: false,
      role: "label",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse-glow"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="flex justify-center mb-8">
            <SLogo className="text-cyan-400 animate-neon-pulse" size={96} />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-6">
            INVEST IN MUSIC
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover emerging artists, invest in their future, and share in
            their success. The future of music investment is here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-lg px-8 py-4"
              onClick={() => setShowRoleSelection(true)}
            >
              Start Investing
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              className="bg-black/50 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-lg px-8 py-4"
              onClick={() => setShowLoginModal(true)}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Why Choose <span className="gradient-text">SPARK</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="artist-metric-card group hover:scale-105 transition-all duration-300"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center group-hover:animate-pulse">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Choose Your <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16">
            Whether you're an investor or artist, we have the perfect plan
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`artist-metric-card relative ${
                  tier.popular ? "ring-2 ring-cyan-500" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-white text-2xl">
                    {tier.name}
                  </CardTitle>
                  <div className="text-4xl font-bold gradient-text">
                    {tier.price}
                    <span className="text-lg text-gray-400">{tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-gray-300"
                      >
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      tier.popular
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                    onClick={() => {
                      if (tier.role === "fan") {
                        setShowFanRegistration(true);
                      } else if (tier.role === "artist") {
                        window.location.href = "/artist-register";
                      } else if (tier.role === "investor") {
                        window.location.href = "/investor-register";
                      } else if (tier.role === "label") {
                        window.location.href = "/label-register";
                      } else {
                        setShowRoleSelection(true);
                      }
                    }}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">€2.4M</div>
            <div className="text-gray-300">Total Invested</div>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">1,200+</div>
            <div className="text-gray-300">Artists Funded</div>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">45%</div>
            <div className="text-gray-300">Average ROI</div>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">89</div>
            <div className="text-gray-300">Countries</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Shape the Future of Music?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of investors and artists building the next generation
            of the music industry
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-lg px-12 py-4"
            onClick={() => setShowRoleSelection(true)}
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Modals */}
      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onLogin={() => setShowLoginModal(false)}
      />

      <RoleSelection
        open={showRoleSelection}
        onOpenChange={setShowRoleSelection}
        onRoleSelect={handleRoleSelect}
      />

      {/* Fan Registration Modal */}
      {showFanRegistration && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <FanRegistration onClose={() => setShowFanRegistration(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
