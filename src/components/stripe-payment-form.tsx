import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Lock, AlertCircle, CheckCircle } from "lucide-react";

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY || "");

interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

function PaymentForm({ clientSecret, amount, onSuccess, onError, onCancel }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !cardComplete) {
      setError("Payment form not ready. Please wait and try again.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Payment form error. Please refresh and try again.");
      setIsProcessing(false);
      return;
    }

    try {
      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (stripeError) {
        console.error("Stripe payment error:", stripeError);
        setError(stripeError.message || "Payment failed. Please try again.");
        onError(stripeError.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log("Payment succeeded:", paymentIntent.id);
        onSuccess(paymentIntent.id);
      } else {
        setError("Payment was not completed. Please try again.");
        onError("Payment not completed");
      }
    } catch (err: any) {
      console.error("Payment processing error:", err);
      setError("An unexpected error occurred. Please try again.");
      onError(err.message || "Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: 'transparent',
        '::placeholder': {
          color: '#9ca3af',
        },
        iconColor: '#60a5fa',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: false,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Amount */}
      <div className="text-center">
        <div className="text-3xl font-bold text-white">${amount}</div>
        <div className="text-gray-400">Investment Amount</div>
      </div>

      {/* Card Input */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-white font-medium">Card Information</span>
            <Lock className="w-4 h-4 text-green-400 ml-auto" />
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
            <CardElement 
              options={cardElementOptions}
              onReady={() => {
                console.log("Stripe CardElement ready");
                setCardReady(true);
              }}
              onChange={(event) => {
                setCardComplete(event.complete);
                if (event.error) {
                  setError(event.error.message);
                } else {
                  setError(null);
                }
              }}
            />
          </div>
          
          <div className="flex items-center text-sm text-gray-400 mt-3">
            <Lock className="w-4 h-4 mr-1" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="bg-red-900/50 border-red-500">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      {/* Payment Buttons */}
      <div className="flex space-x-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !cardReady || !cardComplete || isProcessing}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold"
        >
          {isProcessing ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Investment
            </div>
          )}
        </Button>
      </div>

      {/* 3D Secure Notice */}
      <div className="text-center text-sm text-gray-400">
        <p>Your bank may require additional verification (3D Secure) for this transaction.</p>
      </div>
    </form>
  );
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}