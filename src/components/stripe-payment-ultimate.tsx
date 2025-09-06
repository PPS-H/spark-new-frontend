import { useState, useEffect, useRef, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Lock, Shield } from 'lucide-react';

interface StripePaymentFormProps {
  artist: any;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onBack: () => void;
}

function CheckoutForm({ artist, amount, onSuccess, onError, onBack, resetKey }: StripePaymentFormProps & { resetKey: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const isMountedRef = useRef(true);
  const processingRef = useRef(false);

  // Ensure cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      processingRef.current = false;
    };
  }, []);

  // Create fresh payment intent
  useEffect(() => {
    let isCancelled = false;

    const createPaymentIntent = async () => {
      try {
        console.log(`Creating payment intent for reset ${resetKey}`);
        
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
              artistName: artist.name,
              resetKey: resetKey.toString()
            }
          })
        });
        
        if (isCancelled || !isMountedRef.current) return;
        
        const data = await response.json();
        console.log(`Payment intent created for reset ${resetKey}:`, data.paymentIntentId);
        
        if (!response.ok) {
          throw new Error(data.error || 'Payment setup failed');
        }
        
        if (data.clientSecret && isMountedRef.current && !isCancelled) {
          setClientSecret(data.clientSecret);
        }
      } catch (error: any) {
        if (!isCancelled && isMountedRef.current) {
          console.error(`Payment intent error for reset ${resetKey}:`, error);
          setPaymentError(error.message);
          onError(error.message);
        }
      }
    };

    createPaymentIntent();
    return () => { 
      isCancelled = true; 
    };
  }, [resetKey, amount, artist.id, artist.name, onError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isMountedRef.current || processingRef.current || !stripe || !elements || !clientSecret || !cardReady || !cardComplete) {
      console.log('Payment blocked:', { mounted: isMountedRef.current, processing: processingRef.current, stripe: !!stripe, elements: !!elements, clientSecret: !!clientSecret, cardReady, cardComplete });
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);
    setPaymentError(null);

    try {
      console.log(`Processing payment for reset ${resetKey}`);
      
      // Wait a small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!isMountedRef.current || !processingRef.current) {
        return;
      }

      // Get card element with extra validation
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Verify the element is actually in the DOM
      const cardElementContainer = document.querySelector('[data-testid="card-element"], .StripeElement');
      if (!cardElementContainer) {
        throw new Error('Card element not in DOM');
      }

      console.log(`Creating payment method for reset ${resetKey}`);

      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `Investment in ${artist.name}`,
        },
      });

      if (!isMountedRef.current || !processingRef.current) return;

      if (pmError) {
        throw new Error(pmError.message || 'Payment method creation failed');
      }

      console.log(`Payment method created for reset ${resetKey}:`, paymentMethod.id);

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (!isMountedRef.current || !processingRef.current) return;

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment confirmation failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        console.log(`Payment succeeded for reset ${resetKey}:`, paymentIntent.id);
        processingRef.current = false;
        onSuccess(paymentIntent.id);
      } else {
        throw new Error(`Payment not completed. Status: ${paymentIntent?.status}`);
      }
    } catch (error: any) {
      if (isMountedRef.current && processingRef.current) {
        console.error(`Payment error for reset ${resetKey}:`, error);
        setPaymentError(error.message);
        onError(error.message);
      }
    } finally {
      if (isMountedRef.current) {
        processingRef.current = false;
        setIsProcessing(false);
      }
    }
  }, [stripe, elements, clientSecret, cardReady, cardComplete, resetKey, artist.name, onSuccess, onError]);

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
        <p className="text-gray-400">Processing your {amount}€ investment (Reset #{resetKey})</p>
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
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Details (Reset #{resetKey})
            </h3>
            <Lock className="w-4 h-4 text-green-400" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              {clientSecret && (
                <CardElement
                  key={`ultimate-card-${resetKey}-${clientSecret}`}
                  options={cardOptions}
                  onReady={() => {
                    if (isMountedRef.current) {
                      console.log(`CardElement ready for reset ${resetKey}`);
                      setCardReady(true);
                    }
                  }}
                  onChange={(event) => {
                    if (isMountedRef.current) {
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

export default function StripePaymentUltimate({ artist, amount, onSuccess, onError, onBack }: StripePaymentFormProps) {
  const [resetKey, setResetKey] = useState(() => Date.now());
  const [stripePromise, setStripePromise] = useState(() => loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY));

  // Complete reset function
  const resetEverything = useCallback(() => {
    const newResetKey = Date.now();
    console.log(`Complete Stripe reset: ${resetKey} → ${newResetKey}`);
    setResetKey(newResetKey);
    // Force new Stripe instance
    setStripePromise(loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY));
  }, [resetKey]);

  const handleError = useCallback((error: string) => {
    console.log(`Error occurred, triggering reset: ${error}`);
    resetEverything();
    onError(error);
  }, [resetEverything, onError]);

  const handleBack = useCallback(() => {
    console.log('Back navigation, triggering reset');
    resetEverything();
    onBack();
  }, [resetEverything, onBack]);

  const handleSuccess = useCallback((paymentIntentId: string) => {
    console.log(`Payment successful: ${paymentIntentId}`);
    onSuccess(paymentIntentId);
  }, [onSuccess]);

  return (
    <Elements 
      stripe={stripePromise} 
      key={`ultimate-stripe-${resetKey}`}
    >
      <CheckoutForm
        artist={artist}
        amount={amount}
        onSuccess={handleSuccess}
        onError={handleError}
        onBack={handleBack}
        resetKey={resetKey}
      />
    </Elements>
  );
}