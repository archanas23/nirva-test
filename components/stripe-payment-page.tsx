import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, CreditCard, CheckCircle, Loader2, Shield, Lock } from 'lucide-react';
import { StripePaymentService } from '../utils/stripe-payment';

interface StripePaymentPageProps {
  onBack: () => void;
  selectedClass?: any;
  selectedPackage?: any;
  onSuccess: () => void;
}

export function StripePaymentPage({ onBack, selectedClass, selectedPackage, onSuccess }: StripePaymentPageProps) {
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!studentInfo.name || !studentInfo.email) return;

    setIsProcessing(true);
    setError(null);

    try {
      const paymentData = {
        studentName: studentInfo.name,
        studentEmail: studentInfo.email,
        studentPhone: studentInfo.phone,
        amount: selectedClass ? 11 : selectedPackage ? selectedPackage.price : 0,
        classDetails: selectedClass,
        packageDetails: selectedPackage,
      };

      console.log('Creating payment intent with data:', paymentData);
      const clientSecret = await StripePaymentService.createPaymentIntent(paymentData);
      
      if (!clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      console.log('Payment intent created, client secret:', clientSecret);
      console.log('Processing payment...');

      await StripePaymentService.processPayment(
        clientSecret,
        (paymentIntent) => {
          // Payment successful
          console.log('Payment succeeded:', paymentIntent);
          onSuccess();
        },
        (errorMessage) => {
          console.error('Payment failed:', errorMessage);
          setError(errorMessage);
        }
      );
      
    } catch (error: any) {
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-heading">Secure Payment</h1>
          </div>

          {/* Payment Method */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Secure Payment with Stripe</h3>
                </div>
                <p className="text-green-700 text-sm">
                  Your payment is processed securely by Stripe. We accept all major credit cards, debit cards, and digital wallets.
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-green-600">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Bank-level security</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>PCI compliant</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {selectedClass ? 'Single Class' : selectedPackage?.name}
                  </span>
                  <span className="font-bold">
                    ${selectedClass ? '11.00' : selectedPackage ? selectedPackage.price.toFixed(2) : '0.00'}
                  </span>
                </div>
                
                {selectedClass && (
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Class:</strong> {selectedClass.className}</p>
                    <p><strong>Teacher:</strong> {selectedClass.teacher}</p>
                    <p><strong>Date:</strong> {selectedClass.day}</p>
                    <p><strong>Time:</strong> {selectedClass.time}</p>
                  </div>
                )}
                
                {selectedPackage && (
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Package Type:</strong> {selectedPackage.type === 'five' ? '5-Class Package' : '10-Class Package'}</p>
                    <p><strong>Classes Included:</strong> {selectedPackage.type === 'five' ? '5' : '10'}</p>
                  </div>
                )}

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${selectedClass ? '11.00' : selectedPackage ? selectedPackage.price.toFixed(2) : '0.00'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    * Processing fees included in total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="studentName">Full Name *</Label>
                  <Input
                    id="studentName"
                    value={studentInfo.name}
                    onChange={(e) => setStudentInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="studentEmail">Email Address *</Label>
                  <Input
                    id="studentEmail"
                    type="email"
                    value={studentInfo.email}
                    onChange={(e) => setStudentInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="studentPhone">Phone Number</Label>
                  <Input
                    id="studentPhone"
                    value={studentInfo.phone}
                    onChange={(e) => setStudentInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We accept Visa, Mastercard, Discover, and American Express
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="font-mono"
                      maxLength={4}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="billingZip">Billing ZIP Code *</Label>
                  <Input
                    id="billingZip"
                    placeholder="12345"
                    className="font-mono"
                    maxLength={10}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Payment Button */}
          <div className="flex gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing || !studentInfo.name || !studentInfo.email}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${selectedClass ? '11.00' : selectedPackage ? selectedPackage.price.toFixed(2) : '0.00'}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
