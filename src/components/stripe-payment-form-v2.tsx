import { useState, useEffect, useRef, useCallback } from 'react';
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

function CheckoutForm({ artist, amount, onSuccess, onError, onBack }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const cardElementRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const createPaymentIntent = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      console.log('Creating payment intent with:', { amount, artistId: artist.id, artistName: artist.name });
      
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount: amount,
          currency: "eur",
          artistId: artist.id,
          metadata: {
            artistId: artist.id.toString(),
            artistName: artist.name
          }
        })
      });
      
      const data = await response.json();
      console.log('Payment intent response:', data);
      
      if (!isMountedRef.current) return; // Check if still mounted
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        console.log('Client secret set successfully');
      } else {
        throw new Error(data.error || 'Failed to create payment intent');
      }
    } catch (error: any) {
      if (!isMountedRef.current) return; // Don't update state if unmounted
      console.error('Payment intent creation error:', error);
      setPaymentError(error.message || 'Failed to setup payment');
      onError(error.message || 'Failed to setup payment');
    }
  }, [amount, artist.id, artist.name, onError]);

  useEffect(() => {
    createPaymentIntent();
  }, [createPaymentIntent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isMountedRef.current) return;
    
    if (!stripe || !elements || !clientSecret) {
      console.log('Stripe not ready:', { stripe: !!stripe, elements: !!elements, clientSecret: !!clientSecret });
      return;
    }

    if (!cardReady || !cardComplete) {
      setPaymentError('Please complete your card information');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Use the stored card element reference
      const cardElement = cardElementRef.current || elements.getElement(CardElement);
      
      console.log('Payment submission:', {
        cardReady,
        cardComplete,
        cardElement: !!cardElement,
        isMounted: isMountedRef.current,
        stripe: !!stripe,
        elements: !!elements,
        clientSecret: !!clientSecret
      });

      if (!cardElement) {
        throw new Error('Payment form not ready - please refresh and try again');
      }

      // Check if element is still in DOM
      if (cardElement._element && !document.body.contains(cardElement._element)) {
        throw new Error('Payment form disconnected - please refresh and try again');
      }

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `Investment in ${artist.name}`,
          },
        },
      });

      if (!isMountedRef.current) return; // Check if still mounted

      if (error) {
        throw new Error(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else {
        throw new Error('Payment not completed');
      }
    } catch (error: any) {
      if (!isMountedRef.current) return; // Don't update state if unmounted
      console.error('Payment error:', error);
      setPaymentError(error.message || 'Payment failed');
      onError(error.message || 'Payment failed');
    } finally {
      if (isMountedRef.current) {
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
        '::placeholder': {
          color: '#94a3b8',
        },
      },
      invalid: {
        color: '#ef4444',
      },
      complete: {
        color: '#10b981',
      },
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

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <CardElement
                key={`card-element-${clientSecret}`}
                options={cardOptions}
                onReady={(element) => {
                  if (!isMountedRef.current) return;
                  console.log('CardElement ready and mounted');
                  cardElementRef.current = element;
                  setCardReady(true);
                  setPaymentError(null);
                }}
                onChange={(event) => {
                  if (!isMountedRef.current) return;
                  setCardComplete(event.complete);
                  if (event.error) {
                    setPaymentError(event.error.message);
                  } else {
                    setPaymentError(null);
                  }
                }}
              />
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
                disabled={!stripe || !elements || !clientSecret || !cardReady || !cardComplete || isProcessing}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
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

export default function StripePaymentForm({ artist, amount, onSuccess, onError, onBack }: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        artist={artist}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
        onBack={onBack}
      />
    </Elements>
  );
}