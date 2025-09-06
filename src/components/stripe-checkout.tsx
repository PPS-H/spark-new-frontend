import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Initialize Stripe
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface StripeCheckoutProps {
  amount: number;
  artistId: number;
  userId: number;
  jurisdiction: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

function CheckoutForm({ amount, artistId, userId, jurisdiction, onSuccess, onError }: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Confirm the payment with 3D Secure
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Return URL after 3D Secure authentication
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
        onError(error.message || "Payment failed");
      } else if (paymentIntent.status === 'succeeded') {
        toast({
          title: "Payment Successful",
          description: "3D Secure authentication completed successfully!",
        });
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      console.error("Payment error:", error);
      onError("Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white font-medium mb-2">Secure Payment</h3>
        <p className="text-gray-400 text-sm mb-4">
          Your payment is protected by 3D Secure authentication
        </p>
        <PaymentElement />
      </div>
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
      >
        {isProcessing ? "Processing..." : `Pay $${amount}`}
      </Button>
    </form>
  );
}

export default function StripeCheckout(props: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initializePayment = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/payments/create-intent", {
        amount: props.amount,
        currency: "usd",
        metadata: {
          artistId: props.artistId.toString(),
          userId: props.userId.toString(),
          jurisdiction: props.jurisdiction
        }
      });

      if (response.demo) {
        // Demo mode - simulate successful payment
        setTimeout(() => {
          props.onSuccess("demo_payment_intent");
        }, 1500);
        return;
      }

      setClientSecret(response.client_secret);
    } catch (error) {
      console.error("Payment initialization failed:", error);
      props.onError("Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  // Initialize payment on component mount
  React.useEffect(() => {
    initializePayment();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stripePromise || !clientSecret) {
    // Fallback for demo mode
    return (
      <div className="space-y-4">
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
          <h3 className="text-blue-400 font-medium mb-2">Demo Payment Mode</h3>
          <p className="text-blue-200 text-sm">
            Real Stripe keys needed for live 3D Secure authentication
          </p>
        </div>
        <Button 
          onClick={() => props.onSuccess("demo_payment_intent")}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          Simulate Payment Success
        </Button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm {...props} />
    </Elements>
  );
}