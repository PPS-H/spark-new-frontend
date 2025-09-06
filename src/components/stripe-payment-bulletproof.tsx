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

// Helper function to wait for element to be ready
const waitForElementInDOM = async (maxWaitMs = 5000): Promise<CardElement | null> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitMs) {
    const stripeElements = document.querySelectorAll('.StripeElement, [data-testid="card-element"]');
    if (stripeElements.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 200)); // Additional settling time
      return true as any; // We know it exists
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  return null;
};

function CheckoutForm({ artist, amount, onSuccess, onError, onBack, sessionId }: StripePaymentFormProps & { sessionId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [domReady, setDomReady] = useState(false);
  const isMountedRef = useRef(true);
  const cardElementRef = useRef<CardElement | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cardElementRef.current = null;
    };
  }, []);

  // Create payment intent
  useEffect(() => {
    let isCancelled = false;

    const createPaymentIntent = async () => {
      try {
        console.log(`Creating payment intent for session ${sessionId}`);
        
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
              sessionId
            }
          })
        });
        
        if (isCancelled || !isMountedRef.current) return;
        
        const data = await response.json();
        console.log(`Payment intent created for session ${sessionId}:`, data.paymentIntentId);
        
        if (!response.ok) {
          throw new Error(data.error || 'Payment setup failed');
        }
        
        if (data.clientSecret && isMountedRef.current && !isCancelled) {
          setClientSecret(data.clientSecret);
        }
      } catch (error: any) {
        if (!isCancelled && isMountedRef.current) {
          console.error(`Payment intent error for session ${sessionId}:`, error);
          onError(error.message);
        }
      }
    };

    createPaymentIntent();
    return () => { isCancelled = true; };
  }, [sessionId, amount, artist.id, artist.name, onError]);

  // Wait for DOM readiness
  useEffect(() => {
    if (cardReady && clientSecret) {
      const checkDom = async () => {
        const elementExists = await waitForElementInDOM();
        if (elementExists && isMountedRef.current) {
          setDomReady(true);
          console.log(`DOM ready for session ${sessionId}`);
        }
      };
      checkDom();
    }
  }, [cardReady, clientSecret, sessionId]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isMountedRef.current || isProcessing || !stripe || !elements || !clientSecret || !domReady) {
      console.log('Payment blocked - not ready:', { 
        mounted: isMountedRef.current, 
        processing: isProcessing, 
        stripe: !!stripe, 
        elements: !!elements, 
        clientSecret: !!clientSecret, 
        domReady 
      });
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      console.log(`Starting payment process for session ${sessionId}`);
      
      // Extra wait to ensure everything is stable
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!isMountedRef.current) return;

      // Get card element with multiple attempts
      let cardElement = cardElementRef.current;
      if (!cardElement) {
        cardElement = elements.getElement(CardElement);
        cardElementRef.current = cardElement;
      }

      if (!cardElement) {
        // Final attempt - wait and try again
        await new Promise(resolve => setTimeout(resolve, 1000));
        cardElement = elements.getElement(CardElement);
      }

      if (!cardElement) {
        throw new Error('CardElement could not be retrieved after multiple attempts');
      }

      console.log(`Creating payment method for session ${sessionId}`);

      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `Investment in ${artist.name}`,
        },
      });

      if (!isMountedRef.current) return;

      if (pmError) {
        throw new Error(pmError.message || 'Payment method creation failed');
      }

      console.log(`Payment method created for session ${sessionId}:`, paymentMethod.id);

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (!isMountedRef.current) return;

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment confirmation failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        console.log(`Payment succeeded for session ${sessionId}:`, paymentIntent.id);
        onSuccess(paymentIntent.id);
      } else {
        throw new Error(`Payment not completed. Status: ${paymentIntent?.status}`);
      }
    } catch (error: any) {
      if (isMountedRef.current) {
        console.error(`Payment error for session ${sessionId}:`, error);
        setPaymentError(error.message);
        onError(error.message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsProcessing(false);
      }
    }
  }, [stripe, elements, clientSecret, domReady, isProcessing, sessionId, artist.name, onSuccess, onError]);

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
        <p className="text-gray-400">Processing your {amount}€ investment...</p>
      </div>
    );
  }

  const isFormReady = stripe && clientSecret && cardReady && cardComplete && domReady;

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
              Payment Details
            </h3>
            <div className="flex items-center space-x-2">
              {domReady && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
              <Lock className="w-4 h-4 text-green-400" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              {clientSecret && (
                <CardElement
                  key={`bulletproof-${sessionId}-${clientSecret}`}
                  options={cardOptions}
                  onReady={(element) => {
                    if (isMountedRef.current) {
                      console.log(`CardElement ready for session ${sessionId}`);
                      cardElementRef.current = element;
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
                disabled={!isFormReady || isProcessing}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
              >
                {!clientSecret ? (
                  'Setting up payment...'
                ) : !cardReady ? (
                  'Loading payment form...'
                ) : !domReady ? (
                  'Preparing form...'
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

export default function StripePaymentBulletproof({ artist, amount, onSuccess, onError, onBack }: StripePaymentFormProps) {
  const [sessionId, setSessionId] = useState(() => `session-${Date.now()}`);
  const stripePromise = useRef(loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY));

  const resetSession = useCallback(() => {
    const newSessionId = `session-${Date.now()}`;
    console.log(`Session reset: ${sessionId} → ${newSessionId}`);
    setSessionId(newSessionId);
    // Create new stripe promise
    stripePromise.current = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }, [sessionId]);

  const handleError = useCallback((error: string) => {
    console.log(`Error in session ${sessionId}, resetting:`, error);
    resetSession();
    onError(error);
  }, [sessionId, resetSession, onError]);

  const handleBack = useCallback(() => {
    console.log(`Back navigation from session ${sessionId}`);
    resetSession();
    onBack();
  }, [sessionId, resetSession, onBack]);

  return (
    <Elements 
      stripe={stripePromise.current} 
      key={`bulletproof-elements-${sessionId}`}
    >
      <CheckoutForm
        artist={artist}
        amount={amount}
        onSuccess={onSuccess}
        onError={handleError}
        onBack={handleBack}
        sessionId={sessionId}
      />
    </Elements>
  );
}