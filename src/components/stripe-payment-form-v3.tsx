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

function CheckoutForm({ artist, amount, onSuccess, onError, onBack }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isCardReady, setIsCardReady] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const createPaymentIntent = async () => {
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
        
        if (isCancelled) return;
        
        const data = await response.json();
        console.log('Payment intent response:', data);
        
        if (!response.ok) {
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        if (data.clientSecret && mountedRef.current) {
          setClientSecret(data.clientSecret);
          console.log('Client secret set successfully');
        }
      } catch (error: any) {
        if (!isCancelled && mountedRef.current) {
          console.error('Payment intent creation error:', error);
          setPaymentError(error.message || 'Failed to setup payment');
          onError(error.message || 'Failed to setup payment');
        }
      }
    };

    createPaymentIntent();

    return () => {
      isCancelled = true;
    };
  }, [amount, artist.id, artist.name, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mountedRef.current || !stripe || !elements || !clientSecret || !isCardReady || !isFormValid) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      console.log('Starting payment process...');
      
      // Create payment method using the form
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: `Investment in ${artist.name}`,
        },
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      console.log('Payment method created:', paymentMethod.id);

      // Confirm payment intent
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (!mountedRef.current) return;

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        console.log('Payment successful:', paymentIntent.id);
        onSuccess(paymentIntent.id);
      } else {
        throw new Error('Payment not completed');
      }
    } catch (error: any) {
      if (mountedRef.current) {
        console.error('Payment error:', error);
        setPaymentError(error.message || 'Payment failed');
        onError(error.message || 'Payment failed');
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              {clientSecret && (
                <CardElement
                  key={clientSecret}
                  options={cardOptions}
                  onReady={() => {
                    if (mountedRef.current) {
                      console.log('CardElement ready and mounted');
                      setIsCardReady(true);
                      setPaymentError(null);
                    }
                  }}
                  onChange={(event) => {
                    if (mountedRef.current) {
                      setIsFormValid(event.complete && !event.error);
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
                disabled={!stripe || !clientSecret || !isCardReady || !isFormValid || isProcessing}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
              >
                {!clientSecret ? (
                  'Setting up payment...'
                ) : !isCardReady ? (
                  'Loading payment form...'
                ) : !isFormValid ? (
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

export default function StripePaymentFormV3({ artist, amount, onSuccess, onError, onBack }: StripePaymentFormProps) {
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