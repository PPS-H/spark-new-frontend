import ArtistRegistration from "@/components/artist-registration";
import FanRegistration from "@/components/fan-registration";
import LabelRegistration from "@/components/label-registration";
import React from "react";

const plans = [
  {
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
  },
  {
    id: "artist",
    name: "Artist Pro",
    description: "Fund your projects and connect with investors.",
    price: "$19",
    period: "/month",
    icon: "images/icon-diverse.png",
    popular: false,
    startColor: "#E91E63",
    endColor: "#9C27B0",
    buttonText: "Get Funded",
    features: [
      "Create unlimited campaigns",
      "Direct fan engagement tools",
      "Performance analytics",
      "Exclusive artist community",
    ],
  },
  //   {
  //     id: "premium-investor",
  //     name: "Premium Investor",
  //     description: "Invest in emerging artists and share success.",
  //     price: "$29",
  //     period: "/month",
  //     icon: "images/icon-diverse.png",
  //     popular: true,
  //     startColor: "#00C6FF",
  //     endColor: "#007BFF",
  //     buttonText: "Start Investing",
  //     features: [
  //       "Early access to new artist campaigns",
  //       "Exclusive investor insights",
  //       "Voting rights on artist development",
  //       "Higher revenue share",
  //     ],
  //   },
  {
    id: "label",
    name: "Label Suite",
    description: "Manage multiple artists and large scale investments.",
    price: "$99",
    period: "/month",
    icon: "images/icon-diverse.png",
    popular: false,
    startColor: "#FF9800",
    endColor: "#FF5722",
    buttonText: "Explore Suite",
    features: [
      "Multi-artist dashboard",
      "Advanced market analysis",
      "Dedicated account manager",
      "White-label branding options",
    ],
  },
];

interface PlanCardProps {
  plan: (typeof plans)[0];
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
        {plan.features.map((feature, index) => (
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

  const handlePlanSelect = (planId: any) => {
    // Handle plan selection logic here
    console.log(`Selected plan: ${planId}`);
    setRegistrationForm(planId);
    // You can navigate to registration page or handle the selection as needed
    // For example: navigate(`/register?plan=${planId}`);
  };

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
      </div>
    </section>
  );
};

export default Plans;
