import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, CreditCard, CheckCircle, Loader2, Shield, Lock } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface StripeElementsPaymentProps {
  onBack: () => void;
  selectedClass?: any;
  selectedPackage?: any;
  onSuccess: () => void;
  user?: {
    name?: string;
    email: string;
  } | null;
}

function PaymentForm({ onBack, selectedClass, selectedPackage, onSuccess, user }: StripeElementsPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [studentInfo, setStudentInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setStudentInfo({
        name: user.name || '',
        email: user.email || '',
        phone: ''
      });
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPackage ? selectedPackage.price : 11,
          currency: 'usd',
          metadata: {
            studentName: studentInfo.name,
            studentEmail: studentInfo.email,
            studentPhone: studentInfo.phone,
            classDetails: JSON.stringify(selectedClass || {}),
            packageDetails: JSON.stringify(selectedPackage || {})
          }
        })
      });

      const { clientSecret } = await response.json();

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: studentInfo.name,
            email: studentInfo.email,
            phone: studentInfo.phone,
          },
        },
      });

      if (error) {
        setError(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const amount = selectedPackage ? selectedPackage.price : 11;
  const description = selectedPackage ? selectedPackage.name : selectedClass?.name || 'Single Class';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={studentInfo.name}
            onChange={(e) => setStudentInfo(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={studentInfo.email}
            onChange={(e) => setStudentInfo(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            value={studentInfo.phone}
            onChange={(e) => setStudentInfo(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Card Information</Label>
        <div className="p-4 border rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ${amount}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function StripeElementsPayment({ onBack, selectedClass, selectedPackage, onSuccess, user }: StripeElementsPaymentProps) {
  const amount = selectedPackage ? selectedPackage.price : 11;
  const description = selectedPackage ? selectedPackage.name : selectedClass?.name || 'Single Class';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Secure Payment
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Powered by Stripe - Your payment information is secure
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-accent/30 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{description}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPackage ? 'Package' : 'Single Class'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${amount}</div>
                    <div className="text-sm text-muted-foreground">USD</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Your payment information is encrypted and secure</span>
              </div>

              <Elements stripe={stripePromise}>
                <PaymentForm
                  onBack={onBack}
                  selectedClass={selectedClass}
                  selectedPackage={selectedPackage}
                  onSuccess={onSuccess}
                  user={user}
                />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
