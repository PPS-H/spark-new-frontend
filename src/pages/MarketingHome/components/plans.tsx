import ArtistRegistration from "@/components/artist-registration";
import FanRegistration from "@/components/fan-registration";
import LabelRegistration from "@/components/label-registration";
import React from "react";
import { useGetStripeProductsQuery } from "@/store/features/api/stripeApi";
import type { StripeProduct } from "@/store/features/api/stripeApi";

// Static free plan
const freePlan = {
  id: "fan",
  name: "Free Fan",
  description: "Explore and discover artists.",
  price: "Free",
  period: "",
  icon: "images/icon-diverse.png",
  popular: false,
  startColor: "#4CAF50",
  endColor: "#8BC34A",
  buttonText: "Join for Free",
  features: [
    "Access to artist profiles",
    "Follow artists and get updates",
    "Curated playlists",
  ],
};

// Function to convert Stripe product to plan format
const convertStripeProductToPlan = (product: StripeProduct) => {
  const price = product.price;
  const priceAmount = price ? (price.amount / 100).toFixed(0) : "0";
  const pricePeriod = price?.interval === 'month' ? "/month" : `/${price?.interval}`;
  
  // Default colors based on type
  const colors = {
    artist: { start: "#E91E63", end: "#9C27B0" },
    label: { start: "#FF9800", end: "#FF5722" }
  };
  
  const typeColors = colors[product.type] || { start: "#6366F1", end: "#8B5CF6" };
  
  return {
    id: product.type,
    name: product.name,
    description: product.description,
    price: `$${priceAmount}`,
    period: pricePeriod,
    icon: "images/icon-diverse.png",
    popular: false,
    startColor: typeColors.start,
    endColor: typeColors.end,
    buttonText: product.type === 'artist' ? "Get Funded" : "Explore Suite",
    features: product.features.length > 0 ? product.features : (
      // Fallback features if none provided
      product.type === 'artist' 
        ? ["Create unlimited campaigns", "Direct fan engagement tools", "Performance analytics", "Exclusive artist community"]
        : ["Multi-artist dashboard", "Advanced market analysis", "Dedicated account manager", "White-label branding options"]
    ),
    stripeProductId: product.id,
    stripePriceId: price?.id,
  };
};

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  icon: string;
  popular: boolean;
  startColor: string;
  endColor: string;
  buttonText: string;
  features: string[];
  stripeProductId?: string;
  stripePriceId?: string;
}

interface PlanCardProps {
  plan: Plan;
  onPlanSelect: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onPlanSelect }) => {
  const cardStyle = {
    "--start-color": plan.startColor,
    "--end-color": plan.endColor,
    "--hover-border-gradient-start": plan.startColor,
    "--hover-border-gradient-end": plan.endColor,
    "--hover-button-glow-color": plan.endColor,
    "--hover-border-glow-color": plan.endColor,
  } as React.CSSProperties;

  const iconStyle = {
    background: `linear-gradient(135deg, ${plan.startColor}, ${plan.endColor})`,
  };

  const buttonStyle = {
    background: `linear-gradient(90deg, ${plan.startColor}, ${plan.endColor})`,
  };

  return (
    <div
      className={`plan-card ${plan.popular ? "popular" : ""}`}
      style={cardStyle}
    >
      {plan.popular && <div className="popular-tag">Most Popular</div>}

      <div className="plan-icon" style={iconStyle}>
        <img src={plan.icon} alt={`${plan.name} Icon`} />
      </div>

      <h3 className="plan-name">{plan.name}</h3>
      <p className="plan-description">{plan.description}</p>

      <div className="price">
        {plan.price}
        {plan.period && <span className="period">{plan.period}</span>}
      </div>

      <ul className="plan-features">
        {plan.features.map((feature: string, index: number) => (
          <li key={index}>
            <span className="feature-diamond"></span> {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onPlanSelect(plan.id)}
        className="btn btn-primary plan-button"
        style={buttonStyle}
      >
        {plan.buttonText}
      </button>
    </div>
  );
};

const Plans: React.FC = () => {
  const [showRegistrationForm, setRegistrationForm] = React.useState<
    "fan" | "artist" | "label" | null
  >(null);

  
  // Fetch Stripe products
  const { data: stripeProductsData, isLoading: isLoadingProducts, error: productsError } = useGetStripeProductsQuery();

  const handlePlanSelect = (planId: any) => {
    // Handle plan selection logic here
    console.log(`Selected plan: ${planId}`);
    setRegistrationForm(planId);
    // You can navigate to registration page or handle the selection as needed
    // For example: navigate(`/register?plan=${planId}`);
  };

  // Combine free plan with Stripe products
  const plans = React.useMemo(() => {
    const allPlans = [freePlan];
    
    if (stripeProductsData?.data) {
      const stripePlans = stripeProductsData.data.map(convertStripeProductToPlan);
      allPlans.push(...stripePlans);
    }
    
    return allPlans;
  }, [stripeProductsData]);


  console.log("stripeProductsData:::", plans);

  return (
    <section
      className="plans-homepage-section"
      id="our-investment-plans-section"
    >
      {showRegistrationForm === "artist" && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ArtistRegistration onClose={() => setRegistrationForm(null)} />
          </div>
        </div>
      )}
      {showRegistrationForm === "fan" && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <FanRegistration onClose={() => setRegistrationForm(null)} />
          </div>
        </div>
      )}
      {showRegistrationForm === "label" && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <LabelRegistration onClose={() => setRegistrationForm(null)} />
          </div>
        </div>
      )}

      <div className="container">
        <h2>
          <span className="highlight-text">Our Investment Plans</span>
        </h2>
        <p>
          Choose the plan that suits your goals and start your journey with
          SPARK.
        </p>
        
        {isLoadingProducts ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-white">Loading plans...</span>
          </div>
        ) : productsError ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-red-400 mb-2">Failed to load plans</p>
              <p className="text-gray-400 text-sm">Please try refreshing the page</p>
            </div>
          </div>
        ) : (
          <div
            id="homepagePlansContainer"
            className="plan-cards-container loaded"
          >
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onPlanSelect={handlePlanSelect}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Plans;
