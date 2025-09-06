import { useState, useEffect, useRef, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
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

export default function StripePaymentAtomic({ artist, amount, onSuccess, onError, onBack }: StripePaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [atomicId] = useState(() => `atomic-${Date.now()}`);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const stripeRef = useRef<any>(null);
  const elementsRef = useRef<any>(null);
  const cardElementRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  // Initialize Stripe completely outside React lifecycle
  useEffect(() => {
    isMountedRef.current = true;
    
    const initializeStripeAtomic = async () => {
      try {
        console.log(`Initializing atomic Stripe for ${atomicId}`);
        
        // Load fresh Stripe instance
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        if (!stripe || !isMountedRef.current) return;
        
        stripeRef.current = stripe;
        
        // Create Elements instance
        const elements = stripe.elements();
        elementsRef.current = elements;
        
        // Create CardElement directly without React
        const cardElement = elements.create('card', {
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
        });
        
        cardElementRef.current = cardElement;
        
        // Mount to DOM container
        if (containerRef.current && isMountedRef.current) {
          cardElement.mount(containerRef.current);
          
          cardElement.on('ready', () => {
            if (isMountedRef.current) {
              console.log(`Atomic CardElement ready for ${atomicId}`);
              setCardReady(true);
            }
          });
          
          cardElement.on('change', (event: any) => {
            if (isMountedRef.current) {
              setCardComplete(event.complete && !event.error);
              if (event.error) {
                setPaymentError(event.error.message);
              } else {
                setPaymentError(null);
              }
            }
          });
        }
        
      } catch (error: any) {
        if (isMountedRef.current) {
          console.error(`Atomic Stripe initialization error for ${atomicId}:`, error);
          onError(error.message);
        }
      }
    };

    initializeStripeAtomic();

    return () => {
      isMountedRef.current = false;
      // Clean up Stripe elements
      if (cardElementRef.current) {
        try {
          cardElementRef.current.unmount();
          cardElementRef.current.destroy();
        } catch (e) {
          console.log('Cleanup error (expected):', e);
        }
      }
    };
  }, [atomicId, onError]);

  // Create payment intent
  useEffect(() => {
    if (!cardReady) return;
    
    let isCancelled = false;

    const createPaymentIntent = async () => {
      try {
        console.log(`Creating payment intent for atomic ${atomicId}`);
        
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
              atomicId
            }
          })
        });
        
        if (isCancelled || !isMountedRef.current) return;
        
        const data = await response.json();
        console.log(`Payment intent created for atomic ${atomicId}:`, data.paymentIntentId);
        
        if (!response.ok) {
          throw new Error(data.error || 'Payment setup failed');
        }
        
        if (data.clientSecret && isMountedRef.current && !isCancelled) {
          setClientSecret(data.clientSecret);
        }
      } catch (error: any) {
        if (!isCancelled && isMountedRef.current) {
          console.error(`Payment intent error for atomic ${atomicId}:`, error);
          onError(error.message);
        }
      }
    };

    createPaymentIntent();
    return () => { isCancelled = true; };
  }, [cardReady, atomicId, amount, artist.id, artist.name, onError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isMountedRef.current || isProcessing || !stripeRef.current || !cardElementRef.current || !clientSecret || !cardComplete) {
      console.log('Atomic payment blocked:', { 
        mounted: isMountedRef.current, 
        processing: isProcessing, 
        stripe: !!stripeRef.current, 
        cardElement: !!cardElementRef.current, 
        clientSecret: !!clientSecret, 
        cardComplete 
      });
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      console.log(`Starting atomic payment for ${atomicId}`);
      
      const stripe = stripeRef.current;
      const cardElement = cardElementRef.current;
      
      // Create payment method using atomic references
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

      console.log(`Atomic payment method created for ${atomicId}:`, paymentMethod.id);

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (!isMountedRef.current) return;

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment confirmation failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        console.log(`Atomic payment succeeded for ${atomicId}:`, paymentIntent.id);
        onSuccess(paymentIntent.id);
      } else {
        throw new Error(`Payment not completed. Status: ${paymentIntent?.status}`);
      }
    } catch (error: any) {
      if (isMountedRef.current) {
        console.error(`Atomic payment error for ${atomicId}:`, error);
        setPaymentError(error.message);
        onError(error.message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsProcessing(false);
      }
    }
  }, [isProcessing, clientSecret, cardComplete, atomicId, artist.name, onSuccess, onError]);

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

  const isFormReady = stripeRef.current && clientSecret && cardReady && cardComplete;

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
              Payment Details (Atomic)
            </h3>
            <div className="flex items-center space-x-2">
              {cardReady && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
              <Lock className="w-4 h-4 text-green-400" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              {/* Atomic Stripe container - no React involvement */}
              <div 
                ref={containerRef}
                className="min-h-[20px]"
                id={`atomic-card-${atomicId}`}
              />
            </div>

            {paymentError && (
              <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-400 text-sm">{paymentError}</p>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-400">
              <Shield className="w-4 h-4 mr-2" />
              <span>Secured by Stripe. Payment processed atomically outside React lifecycle.</span>
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