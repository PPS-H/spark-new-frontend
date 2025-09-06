import { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Lock, Shield } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface StripePaymentFormProps {
  artist: any;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onBack: () => void;
}

function FreshCheckoutForm({ artist, amount, onSuccess, onError, onBack, forceKey }: StripePaymentFormProps & { forceKey: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const mountedRef = useRef(true);
  
  // Destroy on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Create payment intent on mount
  useEffect(() => {
    let cancelled = false;

    const createPaymentIntent = async () => {
      try {
        console.log('Creating fresh payment intent:', { amount, artistId: artist.id, forceKey });
        
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            amount,
            currency: "eur",
            artistId: artist.id,
            metadata: {
              artistId: artist.id.toString(),
              artistName: artist.name
            }
          })
        });
        
        if (cancelled || !mountedRef.current) return;
        
        const data = await response.json();
        console.log('Fresh payment intent created:', data.paymentIntentId);
        
        if (!response.ok) {
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        if (data.clientSecret && mountedRef.current) {
          setClientSecret(data.clientSecret);
        }
      } catch (error: any) {
        if (!cancelled && mountedRef.current) {
          console.error('Payment intent error:', error);
          setPaymentError(error.message);
          onError(error.message);
        }
      }
    };

    createPaymentIntent();
    return () => { cancelled = true; };
  }, [forceKey, amount, artist.id, artist.name, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mountedRef.current || !stripe || !elements || !clientSecret || !cardReady || !cardComplete) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      console.log('Processing payment with fresh elements...');
      
      // Get the fresh card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not available');
      }

      // Create payment method first
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `Investment in ${artist.name}`,
        },
      });

      if (!mountedRef.current) return;

      if (pmError) {
        throw new Error(pmError.message);
      }

      console.log('Payment method created:', paymentMethod.id);

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (!mountedRef.current) return;

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent.id);
        onSuccess(paymentIntent.id);
      } else {
        throw new Error('Payment not completed');
      }
    } catch (error: any) {
      if (mountedRef.current) {
        console.error('Payment error:', error);
        setPaymentError(error.message);
        onError(error.message);
      }
    } finally {
      if (mountedRef.current) {
        setIsProcessing(false);
      }
    }
  };

  const cardOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': { color: '#94a3b8' },
      },
      invalid: { color: '#ef4444' },
      complete: { color: '#10b981' },
    },
    hidePostalCode: true,
  };

  if (isProcessing) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-white font-semibold text-lg">Processing Payment...</h3>
        <p className="text-gray-400">Please wait while we process your {amount}€ investment</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Investment Summary</h3>
              <p className="text-gray-400 text-sm">in {artist.name}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{amount}€</p>
              <p className="text-sm text-gray-400">Investment amount</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm border-t border-slate-600 pt-3">
            <span className="text-gray-400">Processing fee</span>
            <span className="text-white">Free</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total</span>
            <span className="text-white font-semibold">{amount}€</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Details
            </h3>
            <Lock className="w-4 h-4 text-green-400" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              {clientSecret && (
                <CardElement
                  key={`fresh-card-${forceKey}-${clientSecret}`}
                  options={cardOptions}
                  onReady={() => {
                    if (mountedRef.current) {
                      console.log('Fresh CardElement mounted');
                      setCardReady(true);
                    }
                  }}
                  onChange={(event) => {
                    if (mountedRef.current) {
                      setCardComplete(event.complete && !event.error);
                      if (event.error) {
                        setPaymentError(event.error.message);
                      } else {
                        setPaymentError(null);
                      }
                    }
                  }}
                />
              )}
            </div>

            {paymentError && (
              <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-400 text-sm">{paymentError}</p>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-400">
              <Shield className="w-4 h-4 mr-2" />
              <span>Secured by Stripe. Your payment information is encrypted and protected.</span>
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={onBack}
                disabled={isProcessing}
                variant="outline"
                className="flex-1 bg-transparent border-slate-600 hover:bg-slate-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={!stripe || !clientSecret || !cardReady || !cardComplete || isProcessing}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
              >
                {!clientSecret ? (
                  'Setting up payment...'
                ) : !cardReady ? (
                  'Loading payment form...'
                ) : !cardComplete ? (
                  'Complete card information'
                ) : (
                  `Pay ${amount}€`
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StripePaymentFinal({ artist, amount, onSuccess, onError, onBack }: StripePaymentFormProps) {
  // Force complete remount with timestamp key
  const [forceKey, setForceKey] = useState(() => Date.now().toString());
  
  // Reset everything on any error or back action
  const handleError = (error: string) => {
    console.log('Resetting Stripe due to error:', error);
    setForceKey(Date.now().toString());
    onError(error);
  };

  const handleBack = () => {
    console.log('Resetting Stripe due to back navigation');
    setForceKey(Date.now().toString());
    onBack();
  };

  const handleSuccess = (paymentIntentId: string) => {
    console.log('Payment successful, cleanup complete');
    onSuccess(paymentIntentId);
  };

  return (
    <Elements 
      stripe={stripePromise} 
      key={`stripe-elements-${forceKey}`}
    >
      <FreshCheckoutForm
        artist={artist}
        amount={amount}
        onSuccess={handleSuccess}
        onError={handleError}
        onBack={handleBack}
        forceKey={forceKey}
      />
    </Elements>
  );
}