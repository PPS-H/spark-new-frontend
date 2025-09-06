import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Building, ChevronLeft, ChevronRight } from "lucide-react";
import SLogo from "@/components/s-logo";
import { useState, useRef, useEffect } from "react";

interface RoleSelectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleSelect: (role: "artist" | "investor" | "label") => void;
}

export default function RoleSelection({
  open,
  onOpenChange,
  onRoleSelect,
}: RoleSelectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const roles = [
    {
      id: "fan",
      title: "Free",
      description: "Connect with your favorite artists and discover new music",
      price: "€0",
      period: "/forever",
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
      price: "€39.99",
      period: "/month",
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
      price: "€279",
      period: "/month",
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

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // Swipe gauche = suivant
    const isRightSwipe = distance < -50; // Swipe droite = précédent

    if (isLeftSwipe && currentSlide < roles.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, roles.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl bg-gradient-to-br from-slate-950/95 via-blue-950/95 to-purple-950/95 backdrop-blur-xl border-cyan-500/30"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Header FIXE - ne bouge jamais */}
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-white text-center mb-2">
            Choose Your Role
          </DialogTitle>
          <p className="text-gray-400 text-center">
            Select how you want to participate in the SPARK ecosystem
          </p>
        </DialogHeader>

        {/* Desktop: Show all cards in grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mt-6">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all hover:scale-105 hover:shadow-xl bg-gradient-to-br ${role.gradient} ${role.border}`}
              onClick={() => onRoleSelect(role.id as any)}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${role.iconBg} rounded-full flex items-center justify-center`}
                >
                  <role.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {role.title}
                </h3>
                <p className="text-gray-400 mb-4">{role.description}</p>

                {/* Prix format "Dès XX €" */}
                <div className="mb-6">
                  <div className="text-4xl font-bold gradient-text">
                    {role.price}
                    <span className="text-lg text-gray-400">{role.period}</span>
                  </div>
                </div>

                <ul className="text-sm text-gray-300 space-y-2 mb-6 text-left">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full bg-gradient-to-r ${role.iconBg} text-white font-semibold py-3 rounded-full hover:opacity-90 transition-opacity`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRoleSelect(role.id as any);
                  }}
                >
                  Choisir {role.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop: All cards visible */}
        {/* <div className="hidden md:block mt-8 space-y-6">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all hover:scale-105 hover:shadow-xl bg-gradient-to-br ${role.gradient} ${role.border} mx-4`}
              onClick={() => onRoleSelect(role.id as any)}
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${role.iconBg} rounded-full flex items-center justify-center`}
                >
                  <role.icon className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {role.title}
                </h3>
                <p className="text-gray-400 mb-4">{role.description}</p>

                <div className="mb-6">
                  <p className="text-2xl font-bold text-white">
                    Dès {role.price} €
                  </p>
                  <p className="text-sm text-gray-400">par mois</p>
                </div>

                <ul className="text-sm text-gray-300 space-y-2 mb-6 text-left">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full bg-gradient-to-r ${role.iconBg} text-white font-semibold py-3 rounded-full hover:opacity-90 transition-opacity`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRoleSelect(role.id as any);
                  }}
                >
                  Choisir {role.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div> */}

        {/* Mobile: Horizontal swipe */}
        <div className="md:hidden mt-8">
          {/* Zone de swipe centrée et isolée */}
          <div className="flex justify-center">
            <div
              className="w-80 overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: "pan-x" }}
            >
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(-${currentSlide * 320}px)`,
                }}
              >
                {roles.map((role) => (
                  <div key={role.id} className="w-80 flex-shrink-0 px-4">
                    <Card
                      className={`cursor-pointer transition-all hover:scale-105 hover:shadow-xl bg-gradient-to-br ${role.gradient} ${role.border} w-72 mx-auto`}
                      onClick={() => onRoleSelect(role.id as any)}
                    >
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${role.iconBg} rounded-full flex items-center justify-center`}
                        >
                          <role.icon className="w-8 h-8 text-white" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">
                          {role.title}
                        </h3>
                        <p className="text-gray-400 mb-4 text-sm">
                          {role.description}
                        </p>

                        <div className="mb-4">
                          <p className="text-xl font-bold text-white">
                            Dès {role.price} €
                          </p>
                          <p className="text-xs text-gray-400">par mois</p>
                        </div>

                        <ul className="text-xs text-gray-300 space-y-1 mb-4 text-left">
                          {role.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-1 h-1 bg-cyan-400 rounded-full mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <Button
                          className={`w-full bg-gradient-to-r ${role.iconBg} text-white font-semibold py-2 rounded-full hover:opacity-90 transition-opacity text-sm`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRoleSelect(role.id as any);
                          }}
                        >
                          Choisir {role.title}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {roles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-white" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
