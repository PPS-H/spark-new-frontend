import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Check, Star, Zap, Crown } from "lucide-react";
import { useState, useRef } from "react";

interface SubscriptionSwiperProps {
  currentRole: "artist" | "investor" | "label" | "fan";
  onUpgrade?: (plan: string) => void;
}

export default function SubscriptionSwiper({ currentRole, onUpgrade }: SubscriptionSwiperProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const plans = [
    {
      id: "artist",
      title: "Artist",
      description: "Contrôle créatif professionnel",
      price: "39.99",
      popular: false,
      icon: Zap,
      gradient: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-500/30",
      iconBg: "from-purple-500 to-pink-500",
      features: [
        "Tableau de bord professionnel",
        "Campagnes de financement",
        "Analytics avancées",
        "Intégration plateformes",
        "Communication fans",
        "Insights IA"
      ]
    },
    {
      id: "investor",
      title: "Investor",
      description: "Outils d'investissement intelligents",
      price: "99",
      popular: true,
      icon: Star,
      gradient: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/30",
      iconBg: "from-blue-500 to-cyan-500",
      features: [
        "Découverte artistes globaux",
        "Outils d'investissement",
        "Suivi portefeuille",
        "Accès anticipé talents",
        "Intelligence marché",
        "Rapports détaillés"
      ]
    },
    {
      id: "label",
      title: "Label",
      description: "Plateforme de découverte premium",
      price: "279",
      popular: false,
      icon: Crown,
      gradient: "from-yellow-500/10 to-orange-500/10",
      border: "border-yellow-500/30",
      iconBg: "from-yellow-500 to-orange-500",
      features: [
        "Découverte artistes avancée",
        "Outils contact direct",
        "Intelligence marché",
        "Accès exclusif",
        "Analytics prédictives",
        "Support prioritaire"
      ]
    }
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < plans.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < plans.length - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="relative">
      {/* Navigation Buttons Desktop */}
      <div className="hidden md:flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="text-gray-400 hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
          Précédent
        </Button>
        <div className="flex space-x-2">
          {plans.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          disabled={currentSlide === plans.length - 1}
          className="text-gray-400 hover:text-white disabled:opacity-30"
        >
          Suivant
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Swipeable Cards Container */}
      <div 
        ref={containerRef}
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${plans.length * 100}%`
          }}
        >
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentRole;
            
            return (
              <div key={plan.id} className="w-full flex-shrink-0 px-4">
                <Card 
                  className={`relative bg-gradient-to-br ${plan.gradient} ${plan.border} mx-auto max-w-sm transition-all hover:scale-105 ${
                    isCurrentPlan ? 'ring-2 ring-white/50' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1">
                        Le plus populaire
                      </Badge>
                    </div>
                  )}
                  
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-green-500 text-white px-3 py-1">
                        Actuel
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${plan.iconBg} rounded-full flex items-center justify-center`}>
                      <plan.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                    <p className="text-gray-400 mb-4">{plan.description}</p>
                    
                    {/* Prix format "Dès XX €" */}
                    <div className="mb-6">
                      <p className="text-3xl font-bold text-white">
                        Dès {plan.price} €
                      </p>
                      <p className="text-sm text-gray-400">par mois</p>
                    </div>
                    
                    <ul className="text-sm text-gray-300 space-y-3 mb-8 text-left">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${
                        isCurrentPlan 
                          ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                          : `bg-gradient-to-r ${plan.iconBg} hover:opacity-90`
                      } text-white font-semibold py-3 rounded-full transition-opacity`}
                      disabled={isCurrentPlan}
                      onClick={() => onUpgrade?.(plan.id)}
                    >
                      {isCurrentPlan ? 'Plan actuel' : `Passer à ${plan.title}`}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6 md:hidden">
        {plans.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}